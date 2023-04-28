import { EmbeddingModel } from "../../embedding/embed";
import {
  OpenAIEmbedding,
  OpenAIEmbeddingModel,
  generateEmbedding,
} from "./api";

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
    rawOutput.data[0].embedding,
});
