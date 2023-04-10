import { AgentRunObserver } from "./AgentRunObserver";
import { AgentRun } from "./AgentRun";
import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { Step } from "../step/Step";
import { StepResult } from "../step/StepResult";

export class CompositeAgentRunObserver implements AgentRunObserver {
  private observers: AgentRunObserver[];

  constructor(observers: AgentRunObserver[]) {
    this.observers = observers;
  }

  onAgentRunStarted({ run }: { run: AgentRun }): void {
    for (const observer of this.observers) {
      observer.onAgentRunStarted({ run });
    }
  }

  onAgentRunFinished({
    run,
    result,
  }: {
    run: AgentRun;
    result: unknown;
  }): void {
    for (const observer of this.observers) {
      observer.onAgentRunFinished({ run, result });
    }
  }

  onStepGenerationStarted({
    run,
    messages,
  }: {
    run: AgentRun;
    messages: Array<OpenAIChatMessage>;
  }): void {
    for (const observer of this.observers) {
      observer.onStepGenerationStarted({ run, messages });
    }
  }

  onStepGenerationFinished({
    run,
    generatedText,
    step,
  }: {
    run: AgentRun;
    generatedText: string;
    step: Step;
  }): void {
    for (const observer of this.observers) {
      observer.onStepGenerationFinished({ run, generatedText, step });
    }
  }

  onStepExecutionStarted({ run, step }: { run: AgentRun; step: Step }): void {
    for (const observer of this.observers) {
      observer.onStepExecutionStarted({ run, step });
    }
  }

  onStepExecutionFinished({
    run,
    step,
    result,
  }: {
    run: AgentRun;
    step: Step;
    result: StepResult;
  }): void {
    for (const observer of this.observers) {
      observer.onStepExecutionFinished({ run, step, result });
    }
  }
}
