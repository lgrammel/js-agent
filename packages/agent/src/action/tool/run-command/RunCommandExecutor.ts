import { exec } from "child_process";
import { ToolExecutor } from "../ToolExecutor";
import { RunCommandInput, RunCommandOutput } from "./RunCommandAction";

export class RunCommandExecutor
  implements ToolExecutor<RunCommandInput, RunCommandOutput>
{
  readonly workspacePath: string;

  constructor({ workspacePath }: { workspacePath: string }) {
    this.workspacePath = workspacePath;
  }

  async execute({ input: { command } }: { input: RunCommandInput }) {
    const { stdout, stderr } = await new Promise<{
      stdout: string;
      stderr: string;
    }>((resolve, reject) => {
      exec(command, { cwd: this.workspacePath }, (error, stdout, stderr) => {
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
