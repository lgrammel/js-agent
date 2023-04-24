import { Action } from "../action/Action";
import { ActionParameters } from "../action/ActionParameters";
import { RunContext } from "../agent/RunContext";

export type ExecuteToolFunction<INPUT extends ActionParameters, OUTPUT> = (
  {}: {
    input: INPUT;
    action: Action<INPUT, OUTPUT>;
  },
  context: RunContext
) => Promise<{ output: OUTPUT; summary: string }>;
