import { EmbeddingModel } from "../../embedding/EmbeddingModel";
import { OpenAIEmbedding, OpenAIEmbeddingModel } from "./api/OpenAIEmbedding";
import { generateEmbedding } from "./api/generateEmbedding";

export const embeddingModel = ({
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
    rawOutput.data[0]!.embedding,
});
