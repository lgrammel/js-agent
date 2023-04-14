import { AgentRun } from "../agent/AgentRun";
import { Step } from "./Step";
import { StepResult } from "./StepResult";

export abstract class Loop extends Step {
  readonly completedSteps: Array<Step> = [];

  constructor({ type, run }: { type: string; run: AgentRun }) {
    super({ type, run });
  }

  protected abstract getNextStep(): PromiseLike<Step>;

  protected async update({
    step,
    result,
  }: {
    step: Step;
    result: StepResult & {
      type: "succeeded" | "failed";
    };
  }): Promise<void> {
    return Promise.resolve();
  }

  protected isFinished(): boolean {
    return false;
  }

  protected async _execute(): Promise<StepResult> {
    try {
      while (true) {
        if (this.run.isAborted()) {
          return { type: "aborted" };
        }

        this.run.onLoopIterationStarted({ loop: this });

        const step = await this.getNextStep();
        const result = await step.execute();

        if (result.type === "aborted") {
          return { type: "aborted" }; // don't store as completed step
        }

        this.completedSteps.push(step);

        if (step.isDoneStep()) {
          return result;
        }

        await this.update({ step, result });

        if (this.isFinished()) {
          // TODO have a final result
          return { type: "succeeded", summary: "Completed all tasks." };
        }

        this.run.onLoopIterationFinished({ loop: this });
      }
    } catch (error) {
      return {
        type: "failed",
        summary: `Failed to run step`, // TODO better summary
        error,
      };
    }
  }
}
