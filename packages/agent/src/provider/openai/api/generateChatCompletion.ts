import axios from "axios";
import zod from "zod";
import { OpenAIChatMessage } from "../OpenAIChatMessage";

export const OpenAIChatCompletionSchema = zod.object({
  id: zod.string(),
  object: zod.literal("chat.completion"),
  created: zod.number(),
  model: zod.string(),
  choices: zod.array(
    zod.object({
      message: zod.object({
        role: zod.literal("assistant"),
        content: zod.string(),
      }),
      index: zod.number(),
      logprobs: zod.nullable(zod.any()),
      finish_reason: zod.string(),
    })
  ),
  usage: zod.object({
    prompt_tokens: zod.number(),
    completion_tokens: zod.number(),
    total_tokens: zod.number(),
  }),
});

export type OpenAIChatCompletion = zod.infer<typeof OpenAIChatCompletionSchema>;

export type OpenAIChatCompletionModel = "gpt-4" | "gpt-3.5-turbo";

export async function generateChatCompletion({
  apiKey,
  model,
  messages,
  n,
  temperature,
  maxTokens,
  presencePenalty,
  frequencyPenalty,
}: {
  apiKey: string;
  messages: Array<OpenAIChatMessage>;
  model: OpenAIChatCompletionModel;
  n?: number;
  temperature?: number;
  maxTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
}): Promise<OpenAIChatCompletion> {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
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
}
