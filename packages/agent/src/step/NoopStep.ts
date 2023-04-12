import { AgentRun } from "../agent";
import { Step } from "./Step";
import { StepResult } from "./StepResult";

export class NoopStep extends Step {
  readonly summary: string;
  private readonly _isDoneStep: boolean;

  constructor({
    type = "noop",
    run,
    summary,
    isDoneStep = false,
  }: {
    type?: string;
    run: AgentRun;
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
