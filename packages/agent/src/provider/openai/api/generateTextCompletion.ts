import axios from "axios";
import { withOpenAIErrorHandler } from "./OpenAIError";
import {
  OpenAITextCompletion,
  OpenAITextCompletionModel,
  OpenAITextCompletionSchema,
} from "./OpenAITextCompletion";

export async function generateTextCompletion({
  baseUrl = "https://api.openai.com/v1",
  apiKey,
  prompt,
  model,
  n,
  temperature,
  maxTokens,
  presencePenalty,
  frequencyPenalty,
}: {
  baseUrl?: string;
  apiKey: string;
  prompt: string;
  model: OpenAITextCompletionModel;
  n?: number;
  temperature?: number;
  maxTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
}): Promise<OpenAITextCompletion> {
  return withOpenAIErrorHandler(async () => {
    const response = await axios.post(
      `${baseUrl}/completions`,
      JSON.stringify({
        model,
        prompt,
        n,
        temperature,
        max_tokens: maxTokens,
        presence_penalty: presencePenalty,
        frequency_penalty: frequencyPenalty,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return OpenAITextCompletionSchema.parse(response.data);
  });
}
