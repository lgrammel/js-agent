import { Run } from ".";

export type RunController = {
  shouldAbort(run: Run): boolean;
};
