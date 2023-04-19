import { calculateOpenAiCallCostInMillicent } from "../provider/openai/calculateOpenAiCallCostInMillicent";
import { Run } from "./Run";

export const calculateRunCostInMillicent = async ({ run }: { run: Run }) => {
  const callCostsInMillicent = run.recordedCalls.map((call) => {
    if (call.success && call.metadata.model.vendor === "openai") {
      return calculateOpenAiCallCostInMillicent(call);
    }
    return undefined;
  });

  return callCostsInMillicent.reduce(
    (sum: number, cost) => sum + (cost ?? 0),
    0
  );
};
