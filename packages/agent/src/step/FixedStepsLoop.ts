import { Run } from "../agent";
import { Loop } from "./Loop";
import { Step } from "./Step";
import { StepFactory } from "./StepFactory";

export const createFixedStepsLoop =
  <RUN_PROPERTIES>({
    type,
    steps: stepFactories,
  }: {
    type?: string;
    steps: Array<StepFactory<RUN_PROPERTIES>>;
  }): StepFactory<RUN_PROPERTIES> =>
  async (run) => {
    const steps = [];
    for (const factory of stepFactories) {
      steps.push(await factory(run));
    }

    return new FixedStepsLoop({ type, run, steps });
  };

export class FixedStepsLoop<RUN_PROPERTIES> extends Loop<RUN_PROPERTIES> {
  readonly steps: Array<Step<RUN_PROPERTIES>> = [];
  currentStep = 0;

  constructor({
    type = "loop.fixed-steps",
    run,
    steps,
  }: {
    type?: string;
    run: Run<RUN_PROPERTIES>;
    steps: Array<Step<RUN_PROPERTIES>>;
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
