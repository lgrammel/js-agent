import fs from "node:fs/promises";
import path from "node:path";
import { Action } from "../../Action";
import { ToolExecutor } from "../ToolExecutor";
import { WriteFileInput, WriteFileOutput } from "./WriteFileAction";

export class WriteFileExecutor
  implements ToolExecutor<WriteFileInput, WriteFileOutput>
{
  async execute({
    input: { filePath, content },
    context: { workspacePath },
  }: {
    input: WriteFileInput;
    action: Action<WriteFileInput, WriteFileOutput>;
    context: {
      workspacePath: string;
    };
  }) {
    // TODO try-catch
    const fullPath = path.join(workspacePath, filePath);
    await fs.writeFile(fullPath, content);
    const newContent = await fs.readFile(fullPath, "utf-8");

    return {
      summary: `Replaced the content of file ${filePath}.`,
      output: { content: newContent },
    };
  }
}
