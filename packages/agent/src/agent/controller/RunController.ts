import { Run } from "..";

export type RunController<RUN_STATE> = {
  checkCancel(
    run: Run<RUN_STATE>
  ): { shouldCancel: false } | { shouldCancel: true; reason: string };
};
