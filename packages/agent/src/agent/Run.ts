import { Loop } from "../step/Loop";
import { Step } from "../step/Step";
import { StepResult } from "../step/StepResult";
import { createNextId } from "../util/createNextId";
import { EmbedCall } from "./EmbedCall";
import { GenerateCall } from "./GenerateCall";
import { RunController } from "./controller/RunController";
import { RunObserver } from "./observer/RunObserver";

export type PrimitiveRecord = Record<string, string | boolean | number | null>;

export class Run<RUN_STATE> {
  private readonly observer?: RunObserver<RUN_STATE>;
  private readonly nextId = createNextId(1);

  readonly controller: RunController<RUN_STATE>;
  readonly state: RUN_STATE;

  readonly recordedCalls: Array<GenerateCall | EmbedCall> = [];

  root: Step<RUN_STATE> | undefined;

  constructor({
    controller,
    observer,
    initialState,
  }: {
    controller: RunController<RUN_STATE>;
    observer?: RunObserver<RUN_STATE>;
    initialState: RUN_STATE;
  }) {
    this.controller = controller;
    this.observer = observer;
    this.state = initialState;
  }

  generateId({ type }: { type: string }) {
    return `${this.nextId()}-${type}`;
  }

  checkCancel() {
    return this.controller.checkCancel(this);
  }

  private logError(error: unknown) {
    console.error(error); // TODO logger
  }

  onLoopIterationStarted({ loop }: { loop: Loop<RUN_STATE> }) {
    try {
      this.observer?.onLoopIterationStarted?.({ run: this, loop });
    } catch (error) {
      this.logError(error);
    }
  }

  onLoopIterationFinished({ loop }: { loop: Loop<RUN_STATE> }) {
    try {
      this.observer?.onLoopIterationFinished?.({ run: this, loop });
    } catch (error) {
      this.logError(error);
    }
  }

  onStepExecutionStarted({ step }: { step: Step<RUN_STATE> }) {
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
    step: Step<RUN_STATE>;
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
      this.observer?.onRunStarted?.({ run: this });
    } catch (error) {
      this.logError(error);
    }
  }

  onFinish({ result }: { result: StepResult }) {
    try {
      this.observer?.onRunFinished?.({ run: this, result });
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
    step: Step<RUN_STATE>;
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

  recordCall(call: GenerateCall | EmbedCall) {
    // TODO associate with currently active step
    this.recordedCalls.push(call);
  }
}
