import { AgentRun } from "../agent";
import { Step } from "./Step";
import { StepResult } from "./StepResult";

export class ErrorStep extends Step {
  readonly errorMessage: string | undefined;
  readonly error: unknown;

  constructor({
    type = "error",
    run,
    errorMessage,
    error,
  }: {
    type?: string;
    run: AgentRun;
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
