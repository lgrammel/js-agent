import { Step } from "./Step";
import { StepResult } from "./StepResult";

export class ErrorStep extends Step {
  readonly errorMessage: string | undefined;
  readonly error: unknown;

  constructor({
    type = "error",
    generatedText,
    errorMessage,
    error,
  }: {
    type?: string;
    generatedText?: string;
    errorMessage?: string;
    error: unknown;
  }) {
    super({ type, generatedText });

    this.errorMessage = errorMessage;
    this.error = error;
  }

  protected async _run(): Promise<StepResult> {
    return {
      type: "failed",
      summary:
        this.errorMessage ?? (this.error as any)?.message ?? "Task failed.",
      error: this.error,
    };
  }
}
