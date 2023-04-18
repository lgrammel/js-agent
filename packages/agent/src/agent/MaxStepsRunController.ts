import { Run } from ".";
import { RunController } from "./RunController";

export class MaxStepsRunController implements RunController {
  private readonly maxSteps: number;

  constructor({ maxSteps }: { maxSteps: number }) {
    this.maxSteps = maxSteps;
  }

  checkAbort(run: Run) {
    if (run.root!.getStepCount() < this.maxSteps) {
      return { shouldAbort: false as const };
    }

    return {
      shouldAbort: true as const,
      reason: `Maximum number of steps (${this.maxSteps}) exceeded.`,
    };
  }
}
