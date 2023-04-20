import { Run } from "../agent";
import { Step } from "./Step";
import { StepResult } from "./StepResult";

export class ErrorStep<RUN_PROPERTIES> extends Step<RUN_PROPERTIES> {
  readonly errorMessage: string | undefined;
  readonly error: unknown;

  constructor({
    type = "error",
    run,
    errorMessage,
    error,
  }: {
    type?: string;
    run: Run<RUN_PROPERTIES>;
    errorMessage?: string;
    error: unknown;
  }) {
    super({ type, run });

    this.errorMessage = errorMessage;
    this.error = error;
  }

  protected async _execute(): Promise<StepResult> {
    return {
      type: "failed",
      summary:
        this.errorMessage ?? (this.error as any)?.message ?? "Task failed.",
      error: this.error,
    };
  }
}
