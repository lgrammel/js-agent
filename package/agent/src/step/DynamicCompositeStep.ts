import { Controller } from "./Controller";
import { NextStepGenerator } from "./NextStepGenerator";
import { Step, StepResult } from "./Step";

export class DynamicCompositeStep extends Step {
  protected readonly completedSteps: Array<Step> = [];

  readonly nextStepGenerator: NextStepGenerator;

  constructor({
    id,
    nextStepGenerator,
  }: {
    id: string;
    nextStepGenerator: NextStepGenerator;
  }) {
    super({ id, type: "composite.dynamic" });
    this.nextStepGenerator = nextStepGenerator;
  }

  async _run({ controller }: { controller: Controller }): Promise<StepResult> {
    try {
      while (true) {
        if (controller.isRunAborted()) {
          return { type: "aborted" };
        }

        const nextStep = await this.nextStepGenerator.generateNextStep({
          completedSteps: this.completedSteps,
          controller,
        });

        const result = await controller.run({ step: nextStep });

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
        summary: `Failed to run step ${this.id}`, // TODO better summary
        error,
      };
    }
  }
}
