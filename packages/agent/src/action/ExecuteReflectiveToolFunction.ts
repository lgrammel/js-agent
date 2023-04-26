import { ReflectiveToolAction } from "../action/Action";
import { ActionParameters } from "../action/ActionParameters";
import { Run } from "../agent";
import { RunContext } from "../agent/RunContext";

export type ExecuteReflectiveToolFunction<
  INPUT extends ActionParameters,
  OUTPUT,
  RUN_STATE
> = (
  options: {
    input: INPUT;
    action: ReflectiveToolAction<INPUT, OUTPUT, RUN_STATE>;
    run: Run<RUN_STATE>;
  },
  context: RunContext
) => Promise<{ output: OUTPUT; summary: string }>;
