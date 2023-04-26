import { BasicToolAction } from "./Action";
import { ActionParameters } from "./ActionParameters";
import { RunContext } from "../agent/RunContext";

export type ExecuteBasicToolFunction<INPUT extends ActionParameters, OUTPUT> = (
  {}: {
    input: INPUT;
    action: BasicToolAction<INPUT, OUTPUT>;
  },
  context: RunContext
) => Promise<{ output: OUTPUT; summary: string }>;
