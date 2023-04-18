import { GenerateCall } from "./GenerateCall";

export type RunContext = {
  recordCall: null | ((call: GenerateCall) => void);
} | null;
