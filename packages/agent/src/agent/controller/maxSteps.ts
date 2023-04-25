import { Run } from "..";
import { RunController } from "./RunController";

export const maxSteps = <RUN_STATE>(
  maxSteps: number
): RunController<RUN_STATE> => ({
  checkCancel(run: Run<RUN_STATE>) {
    if (run.root!.getStepCount() < maxSteps) {
      return { shouldCancel: false as const };
    }

    return {
      shouldCancel: true as const,
      reason: `Maximum number of steps (${maxSteps}) exceeded.`,
    };
  },
});
