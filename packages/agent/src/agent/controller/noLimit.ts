import { Run } from "..";
import { RunController } from "./RunController";

export const noLimit = <RUN_STATE>(): RunController<RUN_STATE> => ({
  checkAbort(run: Run<RUN_STATE>) {
    return { shouldAbort: false as const };
  },
});
