import { AgentRun } from "../agent/AgentRun";
import { Step } from "./Step";

export interface NextStepGenerator {
  generateNextStep({}: {
    run: AgentRun;
    completedSteps: Array<Step>;
  }): PromiseLike<Step>;
}
