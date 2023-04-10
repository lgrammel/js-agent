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
  static readonly TYPE = "tool.read-file";

  static readonly OUTPUT_SCHEMA = zod.object({
    content: zod.string(),
  });

  constructor({
    executor,
  }: {
    executor: ToolExecutor<ReadFileInput, ReadFileOutput>;
  }) {
    super({
      type: ReadFileAction.TYPE,
      description: "Read file content.",
      inputSchema: zod.object({
        filePath: zod.string(),
      }),
      inputExample: {
        filePath: "{file path relative to the workspace folder}",
      },
      outputSchema: ReadFileAction.OUTPUT_SCHEMA,
      executor,
    });
  }
}
