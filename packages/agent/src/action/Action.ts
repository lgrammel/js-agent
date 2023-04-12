import zod from "zod";
import { ActionParameters } from "./ActionParameters";
import { Step } from "../step/Step";
import { AgentRun } from "../agent";

export interface Action<INPUT extends ActionParameters, OUTPUT> {
  readonly type: string;
  readonly description: string;

  readonly inputSchema: zod.Schema<INPUT>;
  readonly inputExample?: INPUT;

  readonly outputSchema: zod.Schema<OUTPUT>;

  createStep({ run, input }: { run: AgentRun; input: INPUT }): Promise<Step>;
}
