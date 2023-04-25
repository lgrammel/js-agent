import { GenerateCall } from "../../agent";
import { OpenAIChatCompletionSchema } from "./api/generateChatCompletion";
import { OpenAITextCompletionSchema } from "./api/generateTextCompletion";
import { calculateChatCompletionCostInMillicent } from "./calculateChatCompletionCostInMillicent";
import { calculateTextCompletionCostInMillicent } from "./calculateTextCompletionCostInMillicent";

export function calculateOpenAiCallCostInMillicent(
  call: GenerateCall & {
    success: true;
  }
) {
  if (call.metadata.model.vendor !== "openai") {
    throw new Error(`Incorrect vendor: ${call.metadata.model.vendor}`);
  }

  const model = call.metadata.model.name;

  switch (model) {
    case "gpt-3.5-turbo":
    case "gpt-4": {
      return calculateChatCompletionCostInMillicent({
        model,
        completion: OpenAIChatCompletionSchema.parse(call.rawOutput),
      });
    }

    case "text-davinci-003":
    case "text-davinci-002":
    case "code-davinci-002":
    case "text-curie-001":
    case "text-babbage-001":
    case "text-ada-001":
    case "davinci":
    case "curie":
    case "babbage":
    case "ada": {
      return calculateTextCompletionCostInMillicent({
        model,
        completion: OpenAITextCompletionSchema.parse(call.rawOutput),
      });
    }

    default: {
      throw new Error(`Unknown model: ${model}`);
    }
  }
}
