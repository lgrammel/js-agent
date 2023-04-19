import {
  OpenAIChatCompletion,
  OpenAIChatCompletionModel,
} from "./api/generateChatCompletion";

// see https://openai.com/pricing
const promptTokenCostInMillicent = {
  "gpt-4": 3,
  "gpt-3.5-turbo": 0.2,
};

const completionTokenCostInMillicent = {
  "gpt-4": 6,
  "gpt-3.5-turbo": 0.2,
};

export const calculateChatCompletionCostInMillicent = ({
  model,
  completion,
}: {
  model: OpenAIChatCompletionModel;
  completion: OpenAIChatCompletion;
}) =>
  completion.usage.prompt_tokens * promptTokenCostInMillicent[model] +
  completion.usage.completion_tokens * completionTokenCostInMillicent[model];
