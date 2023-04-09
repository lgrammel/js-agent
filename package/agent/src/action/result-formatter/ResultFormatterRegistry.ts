import { ResultFormatter } from "./ResultFormatter";

export class ResultFormatterRegistry {
  private readonly resultFormatters = new Map<
    string,
    ResultFormatter<unknown>
  >();

  registerResultFormatter({
    type,
    resultFormatter,
  }: {
    type: string;
    resultFormatter: ResultFormatter<unknown>;
  }) {
    this.resultFormatters.set(type, resultFormatter);
  }
  getResultFormatter(type: string) {
    return this.resultFormatters.get(type);
  }
}
