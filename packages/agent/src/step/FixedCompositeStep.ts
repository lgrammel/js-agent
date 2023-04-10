import { AgentRun } from "../agent";
import { Step } from "./Step";
import { StepResult } from "./StepResult";

export class FixedCompositeStep extends Step {
  readonly steps: Array<Step> = [];

  constructor({
    generatedText,
    steps,
  }: {
    generatedText?: string;
    steps: Array<Step>;
  }) {
    super({ generatedText, type: "composite.fixed" });
    this.steps = steps;
  }

  async _run(run: AgentRun): Promise<StepResult> {
    try {
      for (const step of this.steps) {
        if (run.isAborted()) {
          return { type: "aborted" };
        }

        const result = await run.executeStep(step);

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
