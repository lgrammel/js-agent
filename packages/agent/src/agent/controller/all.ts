import { Run } from "..";
import { RunController } from "./RunController";

export const all = <RUN_STATE>(
  ...controllers: RunController<RUN_STATE>[]
): RunController<RUN_STATE> => ({
  checkCancel(run: Run<RUN_STATE>) {
    for (const controller of controllers) {
      const check = controller.checkCancel(run);

      if (check.shouldCancel) {
        return check;
      }
    }

    return { shouldCancel: false as const };
  },
});
