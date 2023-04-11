import { AgentRun } from "../agent/AgentRun";
import { StepResult } from "./StepResult";
import { StepState } from "./StepState";

export abstract class Step {
  readonly type: string;
  readonly generatedText: string | undefined; // TODO remove - this is an artifact of a specific planning mechanism

  state: StepState;

  constructor({
    type,
    generatedText,
  }: {
    type: string;
    generatedText?: string;
  }) {
    this.type = type;
    this.generatedText = generatedText;
    this.state = { type: "pending" };
  }

  protected abstract _run(run: AgentRun): Promise<StepResult>;

  async run(run: AgentRun): Promise<StepResult> {
    if (this.state.type !== "pending") {
      throw new Error(`Step is already running`);
    }

    this.state = { type: "running" };
    const result = await this._run(run);
    this.state = result;
    return result;
  }

  isDoneStep() {
    return false;
  }
}
