import { OpenAITextCompletion, OpenAITextCompletionModel } from "./api";

// see https://openai.com/pricing
const tokenCostInMillicent = {
  davinci: 2,
  "text-davinci-003": 2,
  "text-davinci-002": 2,
  curie: 0.2,
  "text-curie-001": 0.2,
  babbage: 0.05,
  "text-babbage-001": 0.05,
  ada: 0.04,
  "text-ada-001": 0.04,
  "code-davinci-002": 0,
};

export const calculateTextCompletionCostInMillicent = ({
  model,
  completion,
}: {
  model: OpenAITextCompletionModel;
  completion: OpenAITextCompletion;
}) => tokenCostInMillicent[model] * completion.usage.total_tokens;
