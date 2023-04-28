import { GenerateCall } from "../../agent";
import { EmbedCall } from "../../agent/EmbedCall";
import { OpenAIEmbeddingSchema } from "./api";
import { OpenAIChatCompletionSchema } from "./api/generateChatCompletion";
import { OpenAITextCompletionSchema } from "./api/generateTextCompletion";
import { calculateChatCompletionCostInMillicent } from "./calculateChatCompletionCostInMillicent";
import { calculateEmbeddingCostInMillicent } from "./calculateEmbeddingCostInMillicent";
import { calculateTextCompletionCostInMillicent } from "./calculateTextCompletionCostInMillicent";

export function calculateOpenAiCallCostInMillicent(
  call: (GenerateCall | EmbedCall) & {
    success: true;
  }
) {
  if (call.metadata.model.vendor !== "openai") {
    throw new Error(`Incorrect vendor: ${call.metadata.model.vendor}`);
  }

  const type = call.type;

  switch (type) {
    case "generate": {
      const model = call.metadata.model.name;

      switch (model) {
        case "gpt-3.5-turbo":
        case "gpt-4": {
          return calculateChatCompletionCostInMillicent({
            model,
            output: OpenAIChatCompletionSchema.parse(call.rawOutput),
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
            output: OpenAITextCompletionSchema.parse(call.rawOutput),
          });
        }

        default: {
          throw new Error(`Unknown model: ${model}`);
        }
      }
    }

    case "embed": {
      const model = call.metadata.model.name;

      switch (model) {
        case "text-embedding-ada-002": {
          return calculateEmbeddingCostInMillicent({
            model,
            output: OpenAIEmbeddingSchema.parse(call.rawOutput),
          });
        }

        default: {
          throw new Error(`Unknown model: ${model}`);
        }
      }
    }

    default: {
      const _exhaustiveCheck: never = type;
      throw new Error(`Unknown type: ${_exhaustiveCheck}`);
    }
  }
}
