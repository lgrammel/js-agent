import zod from "zod";
import { ActionParameters } from "./ActionParameters";
import { Step } from "../step/Step";

export interface Action<INPUT extends ActionParameters, OUTPUT> {
  readonly type: string;
  readonly description: string;

  readonly inputSchema: zod.Schema<INPUT>;
  readonly inputExample?: INPUT;

  readonly outputSchema: zod.Schema<OUTPUT>;

  createStep({
    generatedText,
    input,
  }: {
    generatedText?: string;
    input: INPUT;
  }): Promise<Step>;
}
