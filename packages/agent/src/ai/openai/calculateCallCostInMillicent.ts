import { OpenAIChatCompletionModel } from "./createChatCompletion";

export function calculateCallCostInMillicent(parameters: {
  model: OpenAIChatCompletionModel;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}) {
  const model = parameters.model;

  switch (model) {
    case "gpt-4": {
      const promptTokenCount = parameters.usage.prompt_tokens;
      const completionTokenCount = parameters.usage.completion_tokens;
      return promptTokenCount * 3 + completionTokenCount * 6; // see https://openai.com/pricing
    }
    case "gpt-3.5-turbo": {
      const promptTokenCount = parameters.usage.prompt_tokens;
      const completionTokenCount = parameters.usage.completion_tokens;
      return promptTokenCount * 0.2 + completionTokenCount * 0.2; // see https://openai.com/pricing
    }
    default: {
      const _exhaustiveCheck: never = model;
      throw new Error(`Unknown model: ${model}`);
    }
  }
}
