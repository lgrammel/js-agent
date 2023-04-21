import zod from "zod";
import { Run } from "../agent";
import { Step } from "../step/Step";
import { ActionParameters } from "./ActionParameters";

export type AnyAction<RUN_PROPERTIES> = Action<any, any, RUN_PROPERTIES>;

export type Action<INPUT extends ActionParameters, OUTPUT, RUN_PROPERTIES> = {
  readonly id: string;
  readonly description: string;

  readonly inputSchema: zod.Schema<INPUT>;
  readonly inputExample?: INPUT;

  readonly outputSchema: zod.Schema<OUTPUT>;

  createStep({
    run,
    input,
  }: {
    run: Run<RUN_PROPERTIES>;
    input: INPUT;
  }): Promise<Step<RUN_PROPERTIES>>;
};
