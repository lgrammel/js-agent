import { ResultFormatter } from "../../ResultFormatter";
import { ReadFileInput, ReadFileOutput } from "./ReadFileAction";

export class ReadFileResultFormatter
  implements ResultFormatter<ReadFileInput, ReadFileOutput>
{
  format({
    summary,
    output: { content },
  }: {
    output: ReadFileOutput;
    summary: string;
  }) {
    return `## ${summary}\n### File content\n${content}`;
  }
}
