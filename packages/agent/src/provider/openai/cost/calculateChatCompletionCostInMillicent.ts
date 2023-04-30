import {
  OpenAIChatCompletion,
  OpenAIChatCompletionModel,
} from "../api/OpenAIChatCompletion";

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
  output,
}: {
  model: OpenAIChatCompletionModel;
  output: OpenAIChatCompletion;
}) =>
  output.usage.prompt_tokens * promptTokenCostInMillicent[model] +
  output.usage.completion_tokens * completionTokenCostInMillicent[model];
