import { ActionParameters } from "./ActionParameters";

export type FormatResultFunction<INPUT extends ActionParameters, OUTPUT> = ({
  input,
  summary,
  output,
}: {
  input: INPUT;
  summary: string;
  output: OUTPUT;
}) => string;
