import { AgentRun } from "../agent/AgentRun";
import { StepResult } from "./StepResult";
import { StepState } from "./StepState";

export abstract class Step {
  readonly id: string;
  readonly type: string;
  readonly run: AgentRun;

  state: StepState;

  constructor({ type, run }: { type: string; run: AgentRun }) {
    if (type == null) {
      throw new Error(`Step type is required`);
    }
    if (run == null) {
      throw new Error(`Step run is required`);
    }

    this.type = type;
    this.run = run;

    this.id = run.generateId({ type });
    this.state = { type: "pending" };
  }

  protected abstract _execute(): Promise<StepResult>;

  async execute(): Promise<StepResult> {
    if (this.run.isAborted()) {
      return { type: "aborted" };
    }

    if (this.state.type !== "pending") {
      throw new Error(`Step is already running`);
    }

    this.state = { type: "running" };
    this.run.onStepExecutionStarted({ step: this });

    let result: StepResult;
    try {
      result = await this._execute();

      return result;
    } catch (error: any) {
      result = {
        type: "failed",
        summary: error.message ?? "Step failed.",
        error,
      };
    }

    this.state = result;
    this.run.onStepExecutionFinished({ step: this, result });

    return result;
  }

  isDoneStep() {
    return false;
  }
}
