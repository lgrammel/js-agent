import zod from "zod";
import { Run } from "../agent/Run";
import { Step } from "../step/Step";
import { ActionParameters } from "./ActionParameters";
import { ExecuteBasicToolFunction } from "./ExecuteBasicToolFunction";
import { ExecuteReflectiveToolFunction } from "./ExecuteReflectiveToolFunction";
import { FormatResultFunction } from "./FormatResultFunction";

export type AnyAction<RUN_STATE> = Action<any, any, RUN_STATE>;

export type Action<INPUT extends ActionParameters, OUTPUT, RUN_STATE> =
  | CustomStepAction<INPUT, OUTPUT, RUN_STATE>
  | BasicToolAction<INPUT, OUTPUT>
  | ReflectiveToolAction<INPUT, OUTPUT, RUN_STATE>;

export type BaseAction<INPUT extends ActionParameters, OUTPUT> = {
  readonly id: string;
  readonly description: string;

  readonly inputSchema: zod.Schema<INPUT>;
  readonly inputExample?: INPUT;

  readonly outputSchema: zod.Schema<OUTPUT>;
};

export type CustomStepAction<
  INPUT extends ActionParameters,
  OUTPUT,
  RUN_STATE
> = BaseAction<INPUT, OUTPUT> & {
  readonly type: "custom-step";
  createStep: (options: {
    input: INPUT;
    run: Run<RUN_STATE>;
  }) => PromiseLike<Step<RUN_STATE>>;
};

export type BasicToolAction<
  INPUT extends ActionParameters,
  OUTPUT
> = BaseAction<INPUT, OUTPUT> & {
  readonly type: "basic-tool";
  execute: ExecuteBasicToolFunction<INPUT, OUTPUT>;
  formatResult: FormatResultFunction<INPUT, OUTPUT>;
};

export type ReflectiveToolAction<
  INPUT extends ActionParameters,
  OUTPUT,
  RUN_STATE
> = BaseAction<INPUT, OUTPUT> & {
  readonly type: "reflective-tool";
  execute: ExecuteReflectiveToolFunction<INPUT, OUTPUT, RUN_STATE>;
  formatResult: FormatResultFunction<INPUT, OUTPUT>;
};
