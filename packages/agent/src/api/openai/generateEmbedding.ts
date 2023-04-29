import axios from "axios";
import {
  OpenAIEmbedding,
  OpenAIEmbeddingModel,
  OpenAIEmbeddingSchema,
} from "./OpenAIEmbedding";

export async function generateEmbedding({
  baseUrl = "https://api.openai.com/v1",
  apiKey,
  model,
  input,
}: {
  baseUrl?: string;
  apiKey: string;
  model: OpenAIEmbeddingModel;
  input: string;
}): Promise<OpenAIEmbedding> {
  const response = await axios.post(
    `${baseUrl}/embeddings`,
    JSON.stringify({
      model,
      input,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  return OpenAIEmbeddingSchema.parse(response.data);
}
