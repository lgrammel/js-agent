import { Run } from "..";

export type RunController<RUN_STATE> = {
  checkAbort(
    run: Run<RUN_STATE>
  ): { shouldAbort: false } | { shouldAbort: true; reason: string };
};
