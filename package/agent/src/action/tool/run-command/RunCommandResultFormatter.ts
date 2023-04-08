import { ResultFormatter } from "../../result-formatter/ResultFormatter";
import { RunCommandInput, RunCommandOutput } from "./RunCommandAction";

export class RunCommandResultFormatter
  implements ResultFormatter<RunCommandInput, RunCommandOutput>
{
  formatResult({
    result: {
      summary,
      output: { stdout, stderr },
    },
  }: {
    result: { output: RunCommandOutput; summary: string };
  }) {
    const stdoutText =
      stdout.trim() !== "" ? `\n### stdout\n${stdout.trim()}` : "";

    const stderrText =
      stderr.trim() !== "" ? `\n### stderr\n${stderr.trim()}` : "";

    return `## ${summary}${stdoutText}${stderrText}`;
  }
}
