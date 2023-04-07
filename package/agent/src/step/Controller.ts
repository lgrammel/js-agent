import { Step } from "./Step";

export interface Controller {
  isRunAborted(): boolean;
  run({ step }: { step: Step }): Promise<void>;
}
