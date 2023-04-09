import { Step } from "./Step";
import { StepResult } from "./StepResult";

export class NoopStep extends Step {
  readonly summary: string;
  private readonly _isDoneStep: boolean;

  constructor({
    type = "noop",
    generatedText,
    summary = generatedText ?? "",
    isDoneStep = false,
  }: {
    type?: string;
    generatedText?: string;
    summary?: string;
    isDoneStep?: boolean;
  }) {
    super({ type, generatedText });
    this.summary = summary;
    this._isDoneStep = isDoneStep;
  }

  protected async _run(): Promise<StepResult> {
    return { type: "succeeded", summary: this.summary };
  }

  isDoneStep() {
    return this._isDoneStep;
  }
}
