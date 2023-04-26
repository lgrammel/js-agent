import { ReflectiveToolAction } from "../action/Action";
import { ActionParameters } from "../action/ActionParameters";
import { RunContext } from "../agent/RunContext";

export type ExecuteReflectiveToolFunction<
  INPUT extends ActionParameters,
  OUTPUT,
  RUN_STATE
> = (
  {}: {
    input: INPUT;
    action: ReflectiveToolAction<INPUT, OUTPUT, RUN_STATE>;
  },
  context: RunContext
) => Promise<{ output: OUTPUT; summary: string }>;
