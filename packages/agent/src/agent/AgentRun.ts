import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { AbortController } from "../step/AbortController";
import { Step } from "../step/Step";
import { StepResult } from "../step/StepResult";
import { createNextId } from "../util/createNextId";
import { Agent } from "./Agent";
import { AgentRunObserver } from "./AgentRunObserver";

export class AgentRun {
  private readonly observer?: AgentRunObserver;
  private readonly nextId = createNextId(1);

  readonly agent: Agent;
  readonly controller: AbortController;
  readonly task: string;

  constructor({
    agent,
    controller,
    observer,
    task,
  }: {
    agent: Agent;
    controller: AbortController;
    observer?: AgentRunObserver;
    task: string;
  }) {
    this.agent = agent;
    this.controller = controller;
    this.observer = observer;
    this.task = task;
  }

  generateId({ type }: { type: string }) {
    return `${this.nextId()}-${type}`;
  }

  isAborted() {
    return this.controller.isRunAborted();
  }

  onStepExecutionStarted({ step }: { step: Step }) {
    try {
      this.observer?.onStepExecutionStarted({ run: this, step });
    } catch (error) {
      console.error(error); // TODO logger
    }
  }

  onStepExecutionFinished({
    step,
    result,
  }: {
    step: Step;
    result: StepResult;
  }) {
    try {
      this.observer?.onStepExecutionFinished({ run: this, step, result });
    } catch (error) {
      console.error(error); // TODO logger
    }
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
