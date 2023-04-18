import { Run } from ".";
import { RunController } from "./RunController";

export class MaxStepsRunController implements RunController {
  private readonly maxSteps: number;

  constructor({ maxSteps }: { maxSteps: number }) {
    this.maxSteps = maxSteps;
  }

  shouldAbort(run: Run): boolean {
    return run.root!.getStepCount() >= this.maxSteps;
  }
}
