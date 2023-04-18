import { Run } from "..";
import { RunController } from "./RunController";

export const maxSteps = (maxSteps: number): RunController => ({
  checkAbort(run: Run) {
    if (run.root!.getStepCount() < maxSteps) {
      return { shouldAbort: false as const };
    }

    return {
      shouldAbort: true as const,
      reason: `Maximum number of steps (${maxSteps}) exceeded.`,
    };
  },
});
