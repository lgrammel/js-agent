import { ResultFormatter } from "../../ResultFormatter";
import { WriteFileAction, WriteFileOutput } from "./WriteFileAction";

export class WriteFileResultFormatter
  implements ResultFormatter<WriteFileOutput>
{
  readonly outputSchema = WriteFileAction.OUTPUT_SCHEMA;

  readonly type: string;

  constructor({
    type = WriteFileAction.TYPE,
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
    result: { output: WriteFileOutput; summary: string };
  }) {
    return `## ${summary}\n###New file content\n${content}`;
  }
}
