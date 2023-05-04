import axios from "axios";
import {
  OpenAIChatCompletion,
  OpenAIChatCompletionModel,
  OpenAIChatCompletionSchema,
  OpenAIChatMessage,
} from "./OpenAIChatCompletion";
import { withOpenAIErrorHandler } from "./OpenAIError";

export async function generateChatCompletion({
  baseUrl = "https://api.openai.com/v1",
  apiKey,
  model,
  messages,
  n,
  temperature,
  maxTokens,
  presencePenalty,
  frequencyPenalty,
}: {
  baseUrl?: string;
  apiKey: string;
  messages: Array<OpenAIChatMessage>;
  model: OpenAIChatCompletionModel;
  n?: number;
  temperature?: number;
  maxTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
}): Promise<OpenAIChatCompletion> {
  return withOpenAIErrorHandler(async () => {
    const response = await axios.post(
      `${baseUrl}/chat/completions`,
      JSON.stringify({
        model,
        messages,
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

    return OpenAIChatCompletionSchema.parse(response.data);
  });
}
