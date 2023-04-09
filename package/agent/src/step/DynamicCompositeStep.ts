import { AgentRun } from "../agent/AgentRun";
import { NextStepGenerator } from "./NextStepGenerator";
import { Step } from "./Step";
import { StepResult } from "./StepResult";

export class DynamicCompositeStep extends Step {
  protected readonly completedSteps: Array<Step> = [];

  readonly nextStepGenerator: NextStepGenerator;

  constructor({ nextStepGenerator }: { nextStepGenerator: NextStepGenerator }) {
    super({ type: "composite.dynamic" });
    this.nextStepGenerator = nextStepGenerator;
  }

  async _run(run: AgentRun): Promise<StepResult> {
    try {
      while (true) {
        if (run.isAborted()) {
          return { type: "aborted" };
        }

        const nextStep = await this.nextStepGenerator.generateNextStep({
          completedSteps: this.completedSteps,
          run,
        });

        const result = await run.executeStep(nextStep);

        if (result.type === "aborted") {
          return { type: "aborted" }; // don't store as completed step
        }

        this.completedSteps.push(nextStep);

        if (nextStep.isDoneStep()) {
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
  }
}
