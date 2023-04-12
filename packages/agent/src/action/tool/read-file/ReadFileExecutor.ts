import fs from "node:fs/promises";
import path from "node:path";
import { ToolExecutor } from "../ToolExecutor";
import { ReadFileInput, ReadFileOutput } from "./ReadFileAction";

export class ReadFileExecutor
  implements ToolExecutor<ReadFileInput, ReadFileOutput>
{
  readonly workspacePath: string;

  constructor({ workspacePath }: { workspacePath: string }) {
    this.workspacePath = workspacePath;
  }

  async execute({ input: { filePath } }: { input: ReadFileInput }) {
    // TODO try-catch
    const fullPath = path.join(this.workspacePath, filePath);
    const content = await fs.readFile(fullPath, "utf-8");

    return {
      summary: `Read file ${filePath}`,
      output: { content },
    };
  }
}
