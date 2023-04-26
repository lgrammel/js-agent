import fs from "node:fs/promises";
import path from "node:path";
import zod from "zod";
import { FormatResultFunction } from "../../action/FormatResultFunction";
import { ExecuteBasicToolFunction } from "../../action/ExecuteBasicToolFunction";
import { BasicToolAction } from "../../action/Action";

export type WriteFileInput = {
  filePath: string;
  content: string;
};

export type WriteFileOutput = {
  content: string;
};

export const writeFile = ({
  id = "write-file",
  description = "Write file content.",
  inputExample = {
    filePath: "{file path relative to the workspace folder}",
    content: "{new file content}",
  },
  execute,
  formatResult = ({ summary, output: { content } }) =>
    `## ${summary}\n### New file content\n${content}`,
}: {
  id?: string;
  description?: string;
  inputExample?: WriteFileInput;
  execute: ExecuteBasicToolFunction<WriteFileInput, WriteFileOutput>;
  formatResult?: FormatResultFunction<WriteFileInput, WriteFileOutput>;
}): BasicToolAction<WriteFileInput, WriteFileOutput> => ({
  type: "basic-tool",
  id,
  description,
  inputSchema: zod.object({
    filePath: zod.string(),
    content: zod.string(),
  }),
  outputSchema: zod.object({
    content: zod.string(),
  }),
  inputExample,
  execute,
  formatResult,
});

export const executeWriteFile =
  ({
    workspacePath,
  }: {
    workspacePath: string;
  }): ExecuteBasicToolFunction<WriteFileInput, WriteFileOutput> =>
  async ({ input: { filePath, content } }) => {
    // TODO try-catch
    const fullPath = path.join(workspacePath, filePath);
    await fs.writeFile(fullPath, content);
    const newContent = await fs.readFile(fullPath, "utf-8");

    return {
      summary: `Replaced the content of file ${filePath}.`,
      output: { content: newContent },
    };
  };
