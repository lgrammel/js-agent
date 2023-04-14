import { ActionParameters } from "./ActionParameters";

export interface ResultFormatter<INPUT extends ActionParameters, OUTPUT> {
  format({
    input,
    summary,
    output,
  }: {
    input: INPUT;
    summary: string;
    output: OUTPUT;
  }): string;
}
