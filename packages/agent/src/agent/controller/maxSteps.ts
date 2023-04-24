import { Run } from "..";
import { RunController } from "./RunController";

export const maxSteps = <RUN_STATE>(
  maxSteps: number
): RunController<RUN_STATE> => ({
  checkAbort(run: Run<RUN_STATE>) {
    if (run.root!.getStepCount() < maxSteps) {
      return { shouldAbort: false as const };
    }

    return {
      shouldAbort: true as const,
      reason: `Maximum number of steps (${maxSteps}) exceeded.`,
    };
  },
});
