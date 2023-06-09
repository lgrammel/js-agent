import { calculateOpenAICallCostInMillicent } from "../provider/openai/cost/calculateOpenAICallCostInMillicent";
import { Run } from "./Run";

export const calculateRunCostInMillicent = async ({
  run,
}: {
  run: Run<unknown>;
}) => {
  const callCostsInMillicent = run.recordedCalls.map((call) => {
    if (call.success && call.metadata.model.vendor === "openai") {
      return calculateOpenAICallCostInMillicent(call);
    }
    return undefined;
  });

  return callCostsInMillicent.reduce(
    (sum: number, cost) => sum + (cost ?? 0),
    0
  );
};
