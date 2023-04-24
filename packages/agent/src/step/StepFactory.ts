import { Run } from "../agent/Run";
import { Step } from "./Step";

export type StepFactory<RUN_STATE> = (
  run: Run<RUN_STATE>
) => Promise<Step<RUN_STATE>>;
