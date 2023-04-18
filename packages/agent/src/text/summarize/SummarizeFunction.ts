import { RunContext } from "../../agent/RunContext";

export type SummarizeFunction = (
  {}: {
    text: string;
    topic: string;
  },
  context: RunContext
) => PromiseLike<string>;
