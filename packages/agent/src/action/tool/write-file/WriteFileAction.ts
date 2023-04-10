import zod from "zod";
import { ToolAction } from "../ToolAction";
import { ToolExecutor } from "../ToolExecutor";

export type WriteFileInput = {
  filePath: string;
  content: string;
};

export type WriteFileOutput = {
  content: string;
};

export class WriteFileAction extends ToolAction<
  WriteFileInput,
  WriteFileOutput
> {
  constructor({
    executor,
  }: {
    executor: ToolExecutor<WriteFileInput, WriteFileOutput>;
  }) {
    super({
      type: "tool.write-file",
      description: "Write file content.",
      inputSchema: zod.object({
        filePath: zod.string(),
        content: zod.string(),
      }),
      inputExample: {
        filePath: "{file path relative to the workspace folder}",
        content: "{new file content}",
      },
      outputSchema: zod.object({
        content: zod.string(),
      }),
      executor,
    });
  }
}
