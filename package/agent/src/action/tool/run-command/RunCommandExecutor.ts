import { exec } from "child_process";
import { Action } from "../../Action";
import { ToolExecutor } from "../ToolExecutor";
import { RunCommandInput, RunCommandOutput } from "./RunCommandAction";

export class RunCommandExecutor
  implements ToolExecutor<RunCommandInput, RunCommandOutput>
{
  async execute({
    input: { command },
    context: { workspacePath },
  }: {
    input: RunCommandInput;
    action: Action<RunCommandInput, RunCommandOutput>;
    context: {
      workspacePath: string;
    };
  }) {
    const { stdout, stderr } = await new Promise<{
      stdout: string;
      stderr: string;
    }>((resolve, reject) => {
      exec(command, { cwd: workspacePath }, (error, stdout, stderr) => {
        resolve({
          stdout,
          stderr,
        });
      });
    });

    return {
      summary: `Command ${command} executed successfully`,
      output: {
        stdout,
        stderr,
      },
    };
  }
}
