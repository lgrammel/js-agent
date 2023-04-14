import { ResultFormatter } from "../../ResultFormatter";
import { WriteFileInput, WriteFileOutput } from "./WriteFileAction";

export class WriteFileResultFormatter
  implements ResultFormatter<WriteFileInput, WriteFileOutput>
{
  format({
    summary,
    output: { content },
  }: {
    output: WriteFileOutput;
    summary: string;
  }) {
    return `## ${summary}\n### New file content\n${content}`;
  }
}
