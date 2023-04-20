import { Run } from "..";

export type RunController<RUN_PROPERTIES> = {
  checkAbort(
    run: Run<RUN_PROPERTIES>
  ): { shouldAbort: false } | { shouldAbort: true; reason: string };
};
