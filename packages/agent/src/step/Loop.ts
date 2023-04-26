import { Run } from "../agent/Run";
import { Step } from "./Step";
import { StepResult } from "./StepResult";

export abstract class Loop<RUN_STATE> extends Step<RUN_STATE> {
  readonly completedSteps: Array<Step<RUN_STATE>> = [];

  constructor({ type, run }: { type: string; run: Run<RUN_STATE> }) {
    super({ type, run });
  }

  protected abstract hasMoreSteps(): boolean;

  protected abstract getNextStep(): PromiseLike<Step<RUN_STATE>>;

  protected async update({
    step,
    result,
  }: {
    step: Step<RUN_STATE>;
    result: StepResult & {
      type: "succeeded" | "failed";
    };
  }): Promise<void> {
    return Promise.resolve();
  }

  protected async getResult(): Promise<StepResult> {
    return { type: "succeeded", summary: "Completed all tasks." };
  }

  protected async _execute(): Promise<StepResult> {
    try {
      while (this.hasMoreSteps()) {
        const cancelCheck = this.run.checkCancel();
        if (cancelCheck.shouldCancel) {
          return { type: "cancelled", reason: cancelCheck.reason };
        }

        this.run.onLoopIterationStarted({ loop: this });

        const step = await this.getNextStep();
        const result = await step.execute();

        this.completedSteps.push(step);

        if (result.type === "cancelled") {
          return result;
        }

        await this.update({ step, result });

        this.run.onLoopIterationFinished({ loop: this });
      }
    } catch (error) {
      return {
        type: "failed",
        summary: `Failed to run step`, // TODO better summary
        error,
      };
    }

    return this.getResult();
  }

  getStepCount(): number {
    return this.completedSteps.reduce(
      (sum, step) => sum + step.getStepCount(),
      0
    );
  }
}
