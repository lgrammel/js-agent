import { RunContext } from "../agent/RunContext";

export type EmbedFunction<EMBEDDING> = (
  options: { value: string },
  context: RunContext
) => Promise<EMBEDDING>;
