import { ResultFormatter } from "./ResultFormatter";

export class ResultFormatterRegistry {
  private readonly formatters = new Map<string, ResultFormatter<unknown>>();

  constructor(formatters: Array<ResultFormatter<unknown>> = []) {
    if (formatters != null) {
      for (const formatter of formatters) {
        this.registerFormatter(formatter);
      }
    }
  }

  registerFormatter(formatter: ResultFormatter<unknown>) {
    this.formatters.set(formatter.type, formatter);
  }

  getFormatter(type: string) {
    return this.formatters.get(type);
  }
}
