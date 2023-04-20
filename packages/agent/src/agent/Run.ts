import { Loop } from "../step/Loop";
import { Step } from "../step/Step";
import { StepResult } from "../step/StepResult";
import { createNextId } from "../util/createNextId";
import { GenerateCall } from "./GenerateCall";
import { RunController } from "./controller/RunController";
import { RunObserver } from "./observer/RunObserver";

export type PrimitiveRecord = Record<string, string | boolean | number | null>;

export class Run<PROPERTIES> {
  private readonly observer?: RunObserver<PROPERTIES>;
  private readonly nextId = createNextId(1);

  readonly controller: RunController<PROPERTIES>;
  readonly properties: PROPERTIES;

  readonly recordedCalls: GenerateCall[] = [];

  root: Step<PROPERTIES> | undefined;

  constructor({
    controller,
    observer,
    properties,
  }: {
    controller: RunController<PROPERTIES>;
    observer?: RunObserver<PROPERTIES>;
    properties: PROPERTIES;
  }) {
    this.controller = controller;
    this.observer = observer;
    this.properties = properties;
  }

  generateId({ type }: { type: string }) {
    return `${this.nextId()}-${type}`;
  }

  checkAbort() {
    return this.controller.checkAbort(this);
  }

  private logError(error: unknown) {
    console.error(error); // TODO logger
  }

  onLoopIterationStarted({ loop }: { loop: Loop<PROPERTIES> }) {
    try {
      this.observer?.onLoopIterationStarted?.({ run: this, loop });
    } catch (error) {
      this.logError(error);
    }
  }

  onLoopIterationFinished({ loop }: { loop: Loop<PROPERTIES> }) {
    try {
      this.observer?.onLoopIterationFinished?.({ run: this, loop });
    } catch (error) {
      this.logError(error);
    }
  }

  onStepExecutionStarted({ step }: { step: Step<PROPERTIES> }) {
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
    step: Step<PROPERTIES>;
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
    step: Step<PROPERTIES>;
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

  recordCall(call: GenerateCall) {
    // TODO associate with currently active step
    this.recordedCalls.push(call);
  }
}
