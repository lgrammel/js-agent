import { Run } from "../agent/Run";
import { RunContext } from "../agent/RunContext";
import { Step } from "../step/Step";
import { StepResult } from "../step/StepResult";
import { ToolAction } from "./ToolAction";

export class ToolStep<
  INPUT extends Record<string, string | undefined>,
  OUTPUT,
  RUN_STATE
> extends Step<RUN_STATE> {
  readonly action: ToolAction<INPUT, OUTPUT>;
  readonly input: INPUT;

  constructor({
    run,
    action,
    input,
  }: {
    run: Run<RUN_STATE>;
    action: ToolAction<INPUT, OUTPUT>;
    input: INPUT;
  }) {
    super({ type: action.id, run });

    this.action = action;
    this.input = input;
  }

  protected async _execute(context: RunContext): Promise<StepResult> {
    try {
      const { output, summary } = await this.action.execute(
        {
          input: this.input,
          action: this.action,
        },
        context
      );

      return {
        type: "succeeded",
        summary,
        input: this.input,
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
