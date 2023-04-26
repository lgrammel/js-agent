import { exec } from "child_process";
import zod from "zod";
import { FormatResultFunction } from "../../action/FormatResultFunction";
import { ExecuteBasicToolFunction } from "../../action/ExecuteBasicToolFunction";
import { BasicToolAction } from "../../action";

export type RunCommandInput = {
  command: string;
};

export type RunCommandOutput = {
  stdout: string;
  stderr: string;
};

export const runCommand = ({
  id = "run-command",
  description = `Run a shell command. The output is shown. Useful commands include:
- ls: list files
- mv: move and rename files`,
  inputExample = {
    command: "{command}",
  },
  execute,
  formatResult = ({ summary, output: { stdout, stderr } }) => {
    const stdoutText =
      stdout.trim() !== "" ? `\n### stdout\n${stdout.trim()}` : "";

    const stderrText =
      stderr.trim() !== "" ? `\n### stderr\n${stderr.trim()}` : "";

    return `## ${summary}${stdoutText}${stderrText}`;
  },
}: {
  id?: string;
  description?: string;
  inputExample?: RunCommandInput;
  execute: ExecuteBasicToolFunction<RunCommandInput, RunCommandOutput>;
  formatResult?: FormatResultFunction<RunCommandInput, RunCommandOutput>;
}): BasicToolAction<RunCommandInput, RunCommandOutput> => ({
  type: "basic-tool",
  id,
  description,
  inputSchema: zod.object({
    command: zod.string(),
  }),
  outputSchema: zod.object({
    stdout: zod.string(),
    stderr: zod.string(),
  }),
  inputExample,
  execute,
  formatResult,
});

export const executeRunCommand =
  ({
    workspacePath,
  }: {
    workspacePath: string;
  }): ExecuteBasicToolFunction<RunCommandInput, RunCommandOutput> =>
  async ({ input: { command } }: { input: RunCommandInput }) => {
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
  };
