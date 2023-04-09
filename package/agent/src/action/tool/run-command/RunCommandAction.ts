import zod from "zod";
import { ToolAction } from "../ToolAction";
import { ToolExecutor } from "../ToolExecutor";

export type RunCommandInput = {
  command: string;
};

export type RunCommandOutput = {
  stdout: string;
  stderr: string;
};

export class RunCommandAction extends ToolAction<
  RunCommandInput,
  RunCommandOutput
> {
  static readonly TYPE = "tool.run-command";

  static readonly OUTPUT_SCHEMA = zod.object({
    stdout: zod.string(),
    stderr: zod.string(),
  });

  constructor({
    executor,
  }: {
    executor: ToolExecutor<RunCommandInput, RunCommandOutput>;
  }) {
    super({
      type: RunCommandAction.TYPE,
      description: `Run a shell command. The output is shown. Useful commands include:
- ls: list files
- mv: move and rename files`,
      inputSchema: zod.object({
        command: zod.string(),
      }),
      inputExample: {
        command: "{command}",
      },
      outputSchema: RunCommandAction.OUTPUT_SCHEMA,
      executor,
    });
  }
}
