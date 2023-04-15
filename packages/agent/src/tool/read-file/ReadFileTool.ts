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
  content: string;
};

export const readFile = ({
  id = "read-file",
  description = "Read file content.",
  inputExample = {
    filePath: "{file path relative to the workspace folder}",
  },
  execute,
  formatResult = ({ summary, output: { content } }) =>
    `## ${summary}\n### File content\n${content}`,
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
      content: zod.string(),
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
    // TODO try-catch
    const fullPath = path.join(workspacePath, filePath);
    const content = await fs.readFile(fullPath, "utf-8");

    return {
      summary: `Read file ${filePath}`,
      output: { content },
    };
  };
