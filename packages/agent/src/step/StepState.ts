export type StepState =
  | {
      type: "pending" | "running";
    }
  | {
      type: "aborted";
      reason: string;
    }
  | {
      type: "succeeded";
      summary: string;
      input?: unknown;
      output?: unknown;
    }
  | {
      type: "failed";
      summary: string;
      input?: unknown;
      error: unknown;
    };
