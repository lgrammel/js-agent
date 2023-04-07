import zod from "zod";
import { ToolAction } from "../ToolAction";
import { ToolExecutor } from "../ToolExecutor";

export type ReadFileInput = {
  filePath: string;
};

export type ReadFileOutput = {
  content: string;
};

export class ReadFileAction extends ToolAction<ReadFileInput, ReadFileOutput> {
  constructor({
    executor,
  }: {
    executor: ToolExecutor<ReadFileInput, ReadFileOutput>;
  }) {
    super({
      type: "tool.read-file",
      description: "Read file content.",
      inputSchema: zod.object({
        filePath: zod.string(),
      }),
      inputExample: {
        filePath: "{file path relative to the workspace folder}",
      },
      outputSchema: zod.object({
        content: zod.string(),
      }),
      executor,
    });
  }
}
