import { Action } from "./Action";
import { ActionParameters } from "./ActionParameters";
import { ResultFormatter } from "./ResultFormatter";

type Pair<INPUT extends ActionParameters, OUTPUT> = {
  action: Action<INPUT, OUTPUT>;
  formatter: ResultFormatter<INPUT, OUTPUT>;
};

export class ResultFormatterRegistry {
  private readonly pairs = new Map<string, Pair<any, any>>();

  constructor(formatterActionPairs: Array<Pair<any, any>> = []) {
    if (formatterActionPairs != null) {
      for (const pair of formatterActionPairs) {
        this.registerFormatter(pair);
      }
    }
  }

  registerFormatter<INPUT extends ActionParameters, OUTPUT>(
    pair: Pair<INPUT, OUTPUT>
  ) {
    this.pairs.set(pair.action.type, pair);
  }

  getFormatter(type: string) {
    return this.pairs.get(type)?.formatter;
  }

  format({
    type,
    input,
    output,
    summary,
  }: {
    type: string;
    input: unknown;
    output: unknown;
    summary: string;
  }): string {
    const resultFormatter = this.getFormatter(type);

    if (resultFormatter == null) {
      return JSON.stringify(output);
    }

    return resultFormatter.format({
      input,
      output,
      summary,
    });
  }
}
