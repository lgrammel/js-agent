import { AbortController } from "../step/AbortController";
import { Loop } from "../step/Loop";
import { Step } from "../step/Step";
import { StepResult } from "../step/StepResult";
import { createNextId } from "../util/createNextId";
import { AgentRunObserver } from "./AgentRunObserver";

export class AgentRun {
  private readonly observer?: AgentRunObserver;
  private readonly nextId = createNextId(1);

  readonly controller: AbortController;
  readonly objective: string;

  constructor({
    controller,
    observer,
    objective,
  }: {
    controller: AbortController;
    observer?: AgentRunObserver;
    objective: string;
  }) {
    this.controller = controller;
    this.observer = observer;
    this.objective = objective;
  }

  generateId({ type }: { type: string }) {
    return `${this.nextId()}-${type}`;
  }

  isAborted() {
    return this.controller.isRunAborted();
  }

  private logError(error: unknown) {
    console.error(error); // TODO logger
  }

  onLoopIterationStarted({ loop }: { loop: Loop }) {
    try {
      this.observer?.onLoopIterationStarted?.({ run: this, loop });
    } catch (error) {
      this.logError(error);
    }
  }

  onLoopIterationFinished({ loop }: { loop: Loop }) {
    try {
      this.observer?.onLoopIterationFinished?.({ run: this, loop });
    } catch (error) {
      this.logError(error);
    }
  }

  onStepExecutionStarted({ step }: { step: Step }) {
    try {
      this.observer?.onStepExecutionStarted?.({ run: this, step });
    } catch (error) {
      this.logError(error);
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
      this.observer?.onStepExecutionFinished?.({ run: this, step, result });
    } catch (error) {
      this.logError(error);
    }
  }

  onStart() {
    try {
      this.observer?.onAgentRunStarted?.({ run: this });
    } catch (error) {
      this.logError(error);
    }
  }

  onFinish({ result }: { result: StepResult }) {
    try {
      this.observer?.onAgentRunFinished?.({ run: this, result });
    } catch (error) {
      this.logError(error);
    }
  }

  onStepGenerationStarted() {
    try {
      this.observer?.onStepGenerationStarted?.({ run: this });
    } catch (error: any) {
      this.logError(error);
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
      this.observer?.onStepGenerationFinished?.({
        run: this,
        generatedText,
        step,
      });
    } catch (error: any) {
      this.logError(error);
    }
  }
}
