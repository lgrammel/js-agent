import { Run } from "..";
import { RunController } from "./RunController";

export const noLimit = <RUN_STATE>(): RunController<RUN_STATE> => ({
  checkCancel(run: Run<RUN_STATE>) {
    return { shouldCancel: false as const };
  },
});
