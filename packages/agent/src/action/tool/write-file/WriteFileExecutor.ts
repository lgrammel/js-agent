import fs from "node:fs/promises";
import path from "node:path";
import { ToolExecutor } from "../ToolExecutor";
import { WriteFileInput, WriteFileOutput } from "./WriteFileAction";

export class WriteFileExecutor
  implements ToolExecutor<WriteFileInput, WriteFileOutput>
{
  readonly workspacePath: string;

  constructor({ workspacePath }: { workspacePath: string }) {
    this.workspacePath = workspacePath;
  }

  async execute({ input: { filePath, content } }: { input: WriteFileInput }) {
    // TODO try-catch
    const fullPath = path.join(this.workspacePath, filePath);
    await fs.writeFile(fullPath, content);
    const newContent = await fs.readFile(fullPath, "utf-8");

    return {
      summary: `Replaced the content of file ${filePath}.`,
      output: { content: newContent },
    };
  }
}
