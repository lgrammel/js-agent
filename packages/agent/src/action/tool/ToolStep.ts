import { AgentRun } from "../../agent";
import { Step } from "../../step/Step";
import { StepResult } from "../../step/StepResult";
import { ToolAction } from "./ToolAction";

export class ToolStep<
  INPUT extends Record<string, string | undefined>,
  OUTPUT
> extends Step {
  readonly action: ToolAction<INPUT, OUTPUT>;
  readonly input: INPUT;

  constructor({
    run,
    action,
    input,
  }: {
    run: AgentRun;
    action: ToolAction<INPUT, OUTPUT>;
    input: INPUT;
  }) {
    super({ type: action.type, run });

    this.action = action;
    this.input = input;
  }

  protected async _execute(): Promise<StepResult> {
    try {
      const { output, summary } = await this.action.executor.execute({
        input: this.input,
        action: this.action,
      });

      return {
        type: "succeeded",
        summary,
        output,
      };
    } catch (error) {
      return {
        type: "failed",
        summary: (error as any)?.message ?? "Task failed.",
        error,
      };
    }
  }
}
