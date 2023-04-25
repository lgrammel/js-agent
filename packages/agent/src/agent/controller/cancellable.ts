import { Run } from "..";
import { RunController } from "./RunController";

export const cancellable = <RUN_STATE>(): RunController<RUN_STATE> & {
  cancel(options: { reason: string }): void;
} => {
  let cancelReason: string | undefined = undefined;

  return {
    cancel({ reason }: { reason: string }) {
      cancelReason = reason;
    },

    checkCancel(run: Run<RUN_STATE>) {
      return cancelReason === undefined
        ? { shouldCancel: false as const }
        : {
            shouldCancel: true as const,
            reason: cancelReason,
          };
    },
  };
};
