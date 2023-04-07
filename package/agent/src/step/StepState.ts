export type StepState =
  | {
      type: "pending" | "running" | "aborted";
    }
  | {
      type: "succeeded";
      summary: string;
      output?: unknown;
    }
  | {
      type: "failed";
      summary: string;
      error: unknown;
    };
