import { ResultFormatter } from "./ResultFormatter";

export class ResultFormatterRegistry {
  private readonly resultFormatters = new Map<
    string,
    ResultFormatter<unknown>
  >();

  constructor(
    formatters: Array<{
      type: string;
      formatter: ResultFormatter<unknown>;
    }> = []
  ) {
    if (formatters != null) {
      for (const formatter of formatters) {
        this.registerResultFormatter(formatter);
      }
    }
  }

  registerResultFormatter({
    type,
    formatter,
  }: {
    type: string;
    formatter: ResultFormatter<unknown>;
  }) {
    this.resultFormatters.set(type, formatter);
  }

  getResultFormatter(type: string) {
    return this.resultFormatters.get(type);
  }
}
