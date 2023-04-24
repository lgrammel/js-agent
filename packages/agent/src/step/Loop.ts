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

  protected async _execute(): Promise<StepResult> {
    try {
      while (this.hasMoreSteps()) {
        const abortCheck = this.run.checkAbort();
        if (abortCheck.shouldAbort) {
          return { type: "aborted", reason: abortCheck.reason };
        }

        this.run.onLoopIterationStarted({ loop: this });

        const step = await this.getNextStep();
        const result = await step.execute();

        this.completedSteps.push(step);

        if (result.type === "aborted") {
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

    // TODO have a final result
    return { type: "succeeded", summary: "Completed all tasks." };
  }

  getStepCount(): number {
    return this.completedSteps.reduce(
      (sum, step) => sum + step.getStepCount(),
      0
    );
  }
}
