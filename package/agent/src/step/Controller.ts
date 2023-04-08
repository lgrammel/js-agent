import { Step, StepResult } from "./Step";

export interface Controller {
  isRunAborted(): boolean;
  run({ step }: { step: Step }): Promise<StepResult>;
}
