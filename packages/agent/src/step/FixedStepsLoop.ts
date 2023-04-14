import { AgentRun } from "../agent";
import { Loop } from "./Loop";
import { Step } from "./Step";
import { StepFactory } from "./StepFactory";

export const createFixedStepsLoop =
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

    return new FixedStepsLoop({ type, run, steps });
  };

export class FixedStepsLoop extends Loop {
  readonly steps: Array<Step> = [];
  currentStep = 0;

  constructor({
    type = "loop.fixed-steps",
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

  protected async getNextStep() {
    return this.steps[this.currentStep++];
  }

  protected hasMoreSteps(): boolean {
    return this.currentStep < this.steps.length;
  }
}
