import zod from "zod";
import { Run } from "../agent";
import { Step } from "../step/Step";
import { ActionParameters } from "./ActionParameters";

export type AnyAction = Action<any, any>;

export type Action<INPUT extends ActionParameters, OUTPUT> = {
  readonly id: string;
  readonly description: string;

  readonly inputSchema: zod.Schema<INPUT>;
  readonly inputExample?: INPUT;

  readonly outputSchema: zod.Schema<OUTPUT>;

  createStep<RUN_STATE>({
    run,
    input,
  }: {
    run: Run<RUN_STATE>;
    input: INPUT;
  }): Promise<Step<RUN_STATE>>;
};
