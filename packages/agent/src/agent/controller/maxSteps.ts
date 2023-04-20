import { Run } from "..";
import { RunController } from "./RunController";

export const maxSteps = <RUN_PROPERTIES>(
  maxSteps: number
): RunController<RUN_PROPERTIES> => ({
  checkAbort(run: Run<RUN_PROPERTIES>) {
    if (run.root!.getStepCount() < maxSteps) {
      return { shouldAbort: false as const };
    }

    return {
      shouldAbort: true as const,
      reason: `Maximum number of steps (${maxSteps}) exceeded.`,
    };
  },
});
