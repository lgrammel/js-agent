import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { AbortController } from "../step/AbortController";
import { Step } from "../step/Step";
import { StepResult } from "../step/StepResult";
import { Agent } from "./Agent";
import { AgentRunObserver } from "./AgentRunObserver";

export class AgentRun {
  private readonly observer?: AgentRunObserver;

  readonly agent: Agent;
  readonly controller: AbortController;
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

  onStart() {
    try {
      this.observer?.onAgentRunStarted({ run: this });
    } catch (error) {
      console.error(error); // TODO logger
    }
  }

  onFinish({ result }: { result: StepResult }) {
    try {
      this.observer?.onAgentRunFinished({ run: this, result });
    } catch (error) {
      console.error(error); // TODO logger
    }
  }

  onStepGenerationStarted({
    messages,
  }: {
    messages: Array<OpenAIChatMessage>;
  }) {
    try {
      this.observer?.onStepGenerationStarted({ run: this, messages });
    } catch (error: any) {
      console.error(error); //TODO logger
    }
  }

  onStepGenerationFinished({
    generatedText,
    step,
  }: {
    generatedText: string;
    step: Step;
  }) {
    try {
      this.observer?.onStepGenerationFinished({
        run: this,
        generatedText,
        step,
      });
    } catch (error: any) {
      console.error(error); //TODO logger
    }
  }
}
