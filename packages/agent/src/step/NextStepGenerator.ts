import { Run } from "../agent/Run";
import { Step } from "./Step";

export interface NextStepGenerator {
  generateNextStep({}: {
    run: Run;
    completedSteps: Array<Step>;
  }): PromiseLike<Step>;
}
