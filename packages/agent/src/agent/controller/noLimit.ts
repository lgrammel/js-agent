import { Run } from "..";
import { RunController } from "./RunController";

export const noLimit = <RUN_PROPERTIES>(): RunController<RUN_PROPERTIES> => ({
  checkAbort(run: Run<RUN_PROPERTIES>) {
    return { shouldAbort: false as const };
  },
});
