import zod from "zod";

export interface ResultFormatter<OUTPUT> {
  readonly outputSchema: zod.Schema<OUTPUT>;
  formatResult({}: { result: { output: OUTPUT; summary: string } }): string;
}
