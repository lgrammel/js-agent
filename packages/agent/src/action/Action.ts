import zod from "zod";
import { ActionParameters } from "./ActionParameters";
import { Step } from "../step/Step";
import { Run } from "../agent";

export type Action<INPUT extends ActionParameters, OUTPUT> = {
  readonly id: string;
  readonly description: string;

  readonly inputSchema: zod.Schema<INPUT>;
  readonly inputExample?: INPUT;

  readonly outputSchema: zod.Schema<OUTPUT>;

  createStep({ run, input }: { run: Run; input: INPUT }): Promise<Step>;
};
