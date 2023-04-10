import { ResultFormatter } from "../../ResultFormatter";
import { ReadFileAction, ReadFileOutput } from "./ReadFileAction";

export class ReadFileResultFormatter
  implements ResultFormatter<ReadFileOutput>
{
  readonly outputSchema = ReadFileAction.OUTPUT_SCHEMA;

  readonly type: string;

  constructor({
    type = ReadFileAction.TYPE,
  }: {
    type?: string;
  } = {}) {
    this.type = type;
  }

  formatResult({
    result: {
      summary,
      output: { content },
    },
  }: {
    result: { output: ReadFileOutput; summary: string };
  }) {
    return `## ${summary}\n###File content\n${content}`;
  }
}
