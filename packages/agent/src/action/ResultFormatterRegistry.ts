import { ResultFormatter } from "./ResultFormatter";

export class ResultFormatterRegistry {
  private readonly resultFormatters = new Map<
    string,
    ResultFormatter<unknown>
  >();

  constructor(formatters: Array<ResultFormatter<unknown>> = []) {
    if (formatters != null) {
      for (const formatter of formatters) {
        this.registerResultFormatter(formatter);
      }
    }
  }

  registerResultFormatter(formatter: ResultFormatter<unknown>) {
    this.resultFormatters.set(formatter.type, formatter);
  }

  getResultFormatter(type: string) {
    return this.resultFormatters.get(type);
  }
}
