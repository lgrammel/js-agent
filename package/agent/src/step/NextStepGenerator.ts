import { Controller } from "./Controller";
import { Step } from "./Step";

export interface NextStepGenerator {
  generateNextStep({}: {
    completedSteps: Array<Step>;
    controller: Controller;
  }): PromiseLike<Step>;
}
