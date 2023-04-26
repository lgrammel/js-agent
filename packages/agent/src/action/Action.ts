import zod from "zod";
import { ActionParameters } from "./ActionParameters";
import { ExecuteBasicToolFunction } from "./ExecuteBasicToolFunction";
import { ExecuteReflectiveToolFunction } from "./ExecuteReflectiveToolFunction";
import { FormatResultFunction } from "./FormatResultFunction";

export type AnyAction<RUN_STATE> = Action<any, any, RUN_STATE>;

export type Action<INPUT extends ActionParameters, OUTPUT, RUN_STATE> =
  | DoneAction<INPUT, OUTPUT>
  | BasicToolAction<INPUT, OUTPUT>
  | ReflectiveToolAction<INPUT, OUTPUT, RUN_STATE>;

export type BaseAction<INPUT extends ActionParameters, OUTPUT> = {
  readonly id: string;
  readonly description: string;

  readonly inputSchema: zod.Schema<INPUT>;
  readonly inputExample?: INPUT;

  readonly outputSchema: zod.Schema<OUTPUT>;
};

export type DoneAction<INPUT extends ActionParameters, OUTPUT> = BaseAction<
  INPUT,
  OUTPUT
> & {
  readonly type: "done";
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
