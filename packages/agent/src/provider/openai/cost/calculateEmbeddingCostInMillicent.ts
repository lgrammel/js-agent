import { OpenAIEmbedding, OpenAIEmbeddingModel } from "../api/OpenAIEmbedding";

// see https://openai.com/pricing
const tokenCostInMillicent = {
  "text-embedding-ada-002": 0.04,
};

export const calculateEmbeddingCostInMillicent = ({
  model,
  output,
}: {
  model: OpenAIEmbeddingModel;
  output: OpenAIEmbedding;
}) => tokenCostInMillicent[model] * output.usage.total_tokens;
