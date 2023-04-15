import zod from "zod";
import { Action } from "../action/Action.js";
import { ActionParameters } from "../action/ActionParameters.js";
import { FormatResultFunction } from "../action/FormatResultFunction.js";
import { AgentRun } from "../agent/AgentRun.js";
import { ExecuteToolFunction } from "./ExecuteToolFunction.js";
import { ToolStep } from "./ToolStep.js";

export type ToolAction<INPUT extends ActionParameters, OUTPUT> = Action<
  INPUT,
  OUTPUT
> & {
  execute: ExecuteToolFunction<INPUT, OUTPUT>;
  formatResult: FormatResultFunction<INPUT, OUTPUT>;
};

export const createToolAction = <INPUT extends ActionParameters, OUTPUT>({
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
  async createStep({
    input,
    run,
  }: {
    input: INPUT;
    run: AgentRun;
  }): Promise<ToolStep<INPUT, OUTPUT>> {
    return new ToolStep({
      action: this,
      input,
      run,
    });
  },
});
