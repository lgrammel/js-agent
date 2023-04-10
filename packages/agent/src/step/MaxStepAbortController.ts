import { AbortController } from "./AbortController";
import { Step } from "./Step";
import { StepResult } from "./StepResult";

export class MaxStepAbortController implements AbortController {
  private readonly maxSteps: number;
  private stepCount: number = 0;

  constructor({ maxSteps }: { maxSteps: number }) {
    this.maxSteps = maxSteps;
  }

  isRunAborted(): boolean {
    return this.stepCount >= this.maxSteps;
  }

  // async run({ step }: { step: Step }): Promise<StepResult> {
  //   if (this.isRunAborted()) {
  //     return { type: "aborted" };
  //   }

  //   this.stepCount++;

  //   return step.run({ controller: this });
  // }
}
