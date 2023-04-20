import { Run } from "../agent/Run";
import { Step } from "./Step";

export type StepFactory<RUN_PROPERTIES> = (
  run: Run<RUN_PROPERTIES>
) => Promise<Step<RUN_PROPERTIES>>;
