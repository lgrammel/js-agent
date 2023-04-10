import { StepState } from "./StepState";

export type StepResult = StepState & {
  type: "aborted" | "failed" | "succeeded"; // no pending or running any more
};
