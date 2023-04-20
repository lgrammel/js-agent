import { Action } from "../action/Action";
import { ActionParameters } from "../action/ActionParameters";
import { RunContext } from "../agent/RunContext";

export type ExecuteToolFunction<
  INPUT extends ActionParameters,
  OUTPUT,
  RUN_PROPERTIES
> = (
  {}: {
    input: INPUT;
    action: Action<INPUT, OUTPUT, RUN_PROPERTIES>;
  },
  context: RunContext
) => Promise<{ output: OUTPUT; summary: string }>;
