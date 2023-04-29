import {
  OpenAIEmbedding,
  OpenAIEmbeddingModel,
} from "../../api/openai/OpenAIEmbedding";
import { generateEmbedding } from "../../api/openai/generateEmbedding";
import { EmbeddingModel } from "../../embedding/EmbeddingModel";

export const embedding = ({
  baseUrl,
  apiKey,
  model = "text-embedding-ada-002",
}: {
  baseUrl?: string;
  apiKey: string;
  model?: OpenAIEmbeddingModel;
}): EmbeddingModel<OpenAIEmbedding, number[]> => ({
  vendor: "openai",
  name: model,
  embed: async (input: string): Promise<OpenAIEmbedding> =>
    generateEmbedding({
      baseUrl,
      apiKey,
      input,
      model,
    }),
  extractEmbedding: async (rawOutput: OpenAIEmbedding): Promise<number[]> =>
    rawOutput.data[0].embedding,
});
