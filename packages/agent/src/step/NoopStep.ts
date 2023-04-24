import { Run } from "../agent";
import { Step } from "./Step";
import { StepResult } from "./StepResult";

export class NoopStep<RUN_STATE> extends Step<RUN_STATE> {
  readonly summary: string;
  private readonly _isDoneStep: boolean;

  constructor({
    type = "noop",
    run,
    summary,
    isDoneStep = false,
  }: {
    type?: string;
    run: Run<RUN_STATE>;
    summary: string;
    isDoneStep?: boolean;
  }) {
    super({ type, run });
    this.summary = summary;
    this._isDoneStep = isDoneStep;
  }

  protected async _execute(): Promise<StepResult> {
    return { type: "succeeded", summary: this.summary };
  }

  isDoneStep() {
    return this._isDoneStep;
  }
}
