import { AbortController } from "../step/AbortController";
import { Step } from "../step/Step";
import { StepResult } from "../step/StepResult";
import { Agent } from "./Agent";
import { AgentRunObserver } from "./AgentRunObserver";

export class AgentRun {
  readonly agent: Agent;
  readonly controller: AbortController;
  readonly observer?: AgentRunObserver;
  readonly instructions: string;

  constructor({
    agent,
    controller,
    observer,
    instructions,
  }: {
    agent: Agent;
    controller: AbortController;
    observer?: AgentRunObserver;
    instructions: string;
  }) {
    this.agent = agent;
    this.controller = controller;
    this.observer = observer;
    this.instructions = instructions;
  }

  isAborted() {
    return this.controller.isRunAborted();
  }

  async executeStep(step: Step): Promise<StepResult> {
    if (this.isAborted()) {
      return { type: "aborted" };
    }

    try {
      this.observer?.onStepExecutionStarted({ run: this, step });
    } catch (error) {
      console.error(error); // TODO logger
    }

    const result = await step.run(this);

    try {
      this.observer?.onStepExecutionFinished({ run: this, step, result });
    } catch (error) {
      console.error(error); // TODO logger
    }

    return result;
  }
}
