import zod from "zod";
import { Action } from "../action/Action.js";
import { ActionParameters } from "../action/ActionParameters.js";
import { FormatResultFunction } from "../action/FormatResultFunction.js";
import { Run } from "../agent/Run.js";
import { ExecuteToolFunction } from "./ExecuteToolFunction.js";
import { ToolStep } from "./ToolStep.js";

export type ToolAction<INPUT extends ActionParameters, OUTPUT> = Action<
  INPUT,
  OUTPUT
> & {
  execute: ExecuteToolFunction<INPUT, OUTPUT>;
  formatResult: FormatResultFunction<INPUT, OUTPUT>;
};

export const createToolAction = <
  INPUT extends ActionParameters,
  OUTPUT,
  RUN_STATE
>({
  id,
  description,
  inputSchema,
  inputExample,
  outputSchema,
  execute,
  formatResult,
}: {
  id: string;
  description: string;
  inputSchema: zod.Schema<INPUT>;
  inputExample: INPUT;
  outputSchema: zod.Schema<OUTPUT>;
  execute: ExecuteToolFunction<INPUT, OUTPUT>;
  formatResult: FormatResultFunction<INPUT, OUTPUT>;
}): ToolAction<INPUT, OUTPUT> => ({
  id,
  description,
  inputSchema,
  inputExample,
  outputSchema,
  execute,
  formatResult,
  async createStep<RUN_STATE>({
    input,
    run,
  }: {
    input: INPUT;
    run: Run<RUN_STATE>;
  }): Promise<ToolStep<INPUT, OUTPUT, RUN_STATE>> {
    return new ToolStep({
      action: this,
      input,
      run,
    });
  },
});
