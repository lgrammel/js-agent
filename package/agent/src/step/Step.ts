import { Controller } from "./Controller";
import { StepState } from "./StepState";

export type StepResult = StepState & {
  type: "aborted" | "failed" | "succeeded"; // no pending or running any more
};

export abstract class Step {
  readonly id: string;
  readonly type: string;
  readonly completion: string | undefined;

  state: StepState;

  constructor({
    type,
    id,
    completion,
  }: {
    type: string;
    id: string;
    completion?: string;
  }) {
    this.id = id;
    this.type = type;
    this.completion = completion;
    this.state = { type: "pending" };
  }

  protected abstract _run({
    controller,
  }: {
    controller: Controller;
  }): Promise<StepResult>;

  async run({ controller }: { controller: Controller }): Promise<StepResult> {
    if (this.state.type !== "pending") {
      throw new Error(`Task ${this.id} is already running`);
    }

    this.state = { type: "running" };
    const result = await this._run({ controller });
    this.state = result;
    return result;
  }

  isDoneStep() {
    return false;
  }
}
