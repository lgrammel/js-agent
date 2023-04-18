import { Run } from ".";

export type RunController = {
  checkAbort(
    run: Run
  ): { shouldAbort: false } | { shouldAbort: true; reason: string };
};
