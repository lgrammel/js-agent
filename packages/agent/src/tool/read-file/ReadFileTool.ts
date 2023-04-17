import fs from "node:fs/promises";
import path from "node:path";
import zod from "zod";
import { FormatResultFunction } from "../../action/FormatResultFunction";
import { ExecuteToolFunction } from "../ExecuteToolFunction";
import { createToolAction } from "../ToolAction";

export type ReadFileInput = {
  filePath: string;
};

export type ReadFileOutput = {
  content?: string;
  error?: string;
};

export const readFile = ({
  id = "read-file",
  description = "Read file content.",
  inputExample = {
    filePath: "{file path relative to the workspace folder}",
  },
  execute,
  formatResult = ({ summary, output: { content, error } }) =>
    error
      ? `## ${summary}\n### Error\n${error}`
      : `## ${summary}\n### File content\n${content}`,
}: {
  id?: string;
  description?: string;
  inputExample?: ReadFileInput;
  execute: ExecuteToolFunction<ReadFileInput, ReadFileOutput>;
  formatResult?: FormatResultFunction<ReadFileInput, ReadFileOutput>;
}) =>
  createToolAction({
    id,
    description,
    inputSchema: zod.object({
      filePath: zod.string(),
    }),
    outputSchema: zod.object({
      content: zod.string().optional(),
      error: zod.string().optional(),
    }),
    inputExample,
    execute,
    formatResult,
  });

export const executeReadFile =
  ({
    workspacePath,
  }: {
    workspacePath: string;
  }): ExecuteToolFunction<ReadFileInput, ReadFileOutput> =>
  async ({ input: { filePath } }) => {
    const fullPath = path.join(workspacePath, filePath);
    try {
      const content = await fs.readFile(fullPath, "utf-8");

      return {
        summary: `Read file ${filePath}`,
        output: { content },
      };
    } catch (error: any) {
      if (error.code === "ENOENT") {
        const { dir, files } = await getAvailableFiles(workspacePath, filePath);
        return {
          summary: `File not found.`,
          output: {
            error: `Available files and directories in ${
              dir + path.sep
            }: ${files.join(", ")}`,
          },
        };
      } else {
        throw error;
      }
    }
  };

async function getAvailableFiles(workspacePath: string, filePath: string) {
  // Find lowest existing directory
  const directories = filePath
    .split(path.sep)
    .slice(undefined, -1) // remove the file name
    .filter((directory) => directory !== "");
  let currentPath = "";
  for (const directory of directories) {
    try {
      await fs.access(path.join(workspacePath, currentPath, directory));
      currentPath = path.join(currentPath, directory);
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  // List files and directories
  const files = await fs.readdir(path.join(workspacePath, currentPath));
  return {
    dir: currentPath,
    files: await Promise.all(
      files.map(async (file) => {
        const stat = await fs.stat(path.resolve(workspacePath, file));
        return stat.isDirectory()
          ? path.join(currentPath, file) + path.sep
          : path.join(currentPath, file);
      })
    ),
  };
}
