import { MaxStepAbortController } from "../step/MaxStepAbortController";
import { StepFactory } from "../step/StepFactory";
import { AgentRun } from "./AgentRun";
import { AgentRunObserver } from "./AgentRunObserver";

export class Agent {
  readonly name: string;
  readonly createRootStep: StepFactory;

  constructor({
    name,
    execute: createRootStep,
  }: {
    name: string;
    execute: StepFactory;
  }) {
    if (name == null) {
      throw new Error("name is required");
    }
    if (createRootStep == null) {
      throw new Error("execute is required");
    }

    this.name = name;
    this.createRootStep = createRootStep;
  }

  async run({
    objective,
    observer,
  }: {
    objective: string;
    observer?: AgentRunObserver;
  }) {
    const controller = new MaxStepAbortController({ maxSteps: 100 });

    const run = new AgentRun({
      agent: this,
      controller,
      observer,
      objective,
    });

    const rootStep = await this.createRootStep(run);

    run.onStart();

    const result = await rootStep.execute();

    run.onFinish({ result });
  }
}
