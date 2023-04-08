import fs from "node:fs/promises";
import path from "node:path";
import { Action } from "../../Action";
import { ToolExecutor } from "../ToolExecutor";
import { ReadFileInput, ReadFileOutput } from "./ReadFileAction";

export class ReadFileExecutor
  implements ToolExecutor<ReadFileInput, ReadFileOutput>
{
  async execute({
    input: { filePath },
    context: { workspacePath },
  }: {
    input: ReadFileInput;
    action: Action<ReadFileInput, ReadFileOutput>;
    context: {
      workspacePath: string;
    };
  }) {
    // TODO try-catch
    const fullPath = path.join(workspacePath, filePath);
    const content = await fs.readFile(fullPath, "utf-8");

    return {
      summary: `Read file ${filePath}`,
      output: { content },
    };
  }
}
