import { ResultFormatter } from "../../ResultFormatter";
import { RunCommandInput, RunCommandOutput } from "./RunCommandAction";

export class RunCommandResultFormatter
  implements ResultFormatter<RunCommandInput, RunCommandOutput>
{
  format({
    summary,
    output: { stdout, stderr },
  }: {
    output: RunCommandOutput;
    summary: string;
  }) {
    const stdoutText =
      stdout.trim() !== "" ? `\n### stdout\n${stdout.trim()}` : "";

    const stderrText =
      stderr.trim() !== "" ? `\n### stderr\n${stderr.trim()}` : "";

    return `## ${summary}${stdoutText}${stderrText}`;
  }
}
