export type StepState =
  | {
      type: "pending" | "running" | "aborted";
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
