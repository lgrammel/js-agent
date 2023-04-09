import { MaxStepAbortController } from "../step/MaxStepAbortController";
import { Step } from "../step/Step";
import { AgentRun } from "./AgentRun";
import { AgentRunObserver } from "./AgentRunObserver";

export class Agent {
  readonly name: string;
  readonly rootStep: Step;

  constructor({ name, rootStep }: { name: string; rootStep: Step }) {
    if (name == null) {
      throw new Error("name is required");
    }
    if (rootStep == null) {
      throw new Error("rootStep is required");
    }

    this.name = name;
    this.rootStep = rootStep;
  }

  async run({
    instructions,
    observer,
  }: {
    instructions: string;
    observer?: AgentRunObserver;
  }) {
    const controller = new MaxStepAbortController({ maxSteps: 100 });

    const run = new AgentRun({
      agent: this,
      controller,
      observer,
      instructions,
    });

    observer?.onAgentRunStarted({ run });

    const result = await run.executeStep(this.rootStep);

    observer?.onAgentRunFinished({ run, result });
  }
}
