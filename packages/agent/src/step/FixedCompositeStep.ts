import { AgentRun } from "../agent";
import { Step } from "./Step";
import { StepFactory } from "./StepFactory";
import { StepResult } from "./StepResult";

export const createFixedCompositeStep =
  ({
    type,
    steps: stepFactories,
  }: {
    type?: string;
    steps: Array<StepFactory>;
  }): StepFactory =>
  async (run) => {
    const steps = [];
    for (const factory of stepFactories) {
      steps.push(await factory(run));
    }

    return new FixedCompositeStep({ type, run, steps });
  };

export class FixedCompositeStep extends Step {
  readonly steps: Array<Step> = [];

  constructor({
    type = "composite.fixed",
    run,
    steps,
  }: {
    type?: string;
    run: AgentRun;
    steps: Array<Step>;
  }) {
    super({ type, run });
    this.steps = steps;
  }

  async _execute(): Promise<StepResult> {
    try {
      for (const step of this.steps) {
        if (this.run.isAborted()) {
          return { type: "aborted" };
        }

        const result = await step.execute();

        if (result.type === "aborted") {
          return { type: "aborted" };
        }

        if (step.isDoneStep()) {
          return result;
        }
      }
    } catch (error) {
      return {
        type: "failed",
        summary: `Failed to run step`, // TODO better summary
        error,
      };
    }

    // TODO better summary
    return {
      type: "succeeded",
      summary: `All steps completed successfully`,
    };
  }
}
