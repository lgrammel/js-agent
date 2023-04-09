import zod from "zod";

export interface ResultFormatter<OUTPUT> {
  readonly type: string;
  readonly outputSchema: zod.Schema<OUTPUT>;
  formatResult({}: { result: { output: OUTPUT; summary: string } }): string;
}
