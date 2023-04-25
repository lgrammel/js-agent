import { StepState } from "./StepState";

export type StepResult = StepState & {
  type: "cancelled" | "failed" | "succeeded"; // no pending or running any more
};
