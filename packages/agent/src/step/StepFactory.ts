import { Run } from "../agent/Run";
import { Step } from "./Step";

export type StepFactory = (run: Run) => PromiseLike<Step>;
