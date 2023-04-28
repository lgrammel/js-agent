import { EmbedCall } from "./EmbedCall";
import { GenerateCall } from "./GenerateCall";

export type RunContext = {
  recordCall: null | ((call: GenerateCall | EmbedCall) => void);
} | null;
