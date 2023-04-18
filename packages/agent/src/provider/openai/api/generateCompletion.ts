import axios from "axios";
import zod from "zod";

const OpenAICompletionSchema = zod.object({
  id: zod.string(),
  object: zod.literal("text_completion"),
  created: zod.number(),
  model: zod.string(),
  choices: zod.array(
    zod.object({
      text: zod.string(),
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

export type OpenAICompletion = zod.infer<typeof OpenAICompletionSchema>;

export type OpenAICompletionModel =
  | "text-davinci-003"
  | "text-davinci-002"
  | "code-davinci-002"
  | "code-davinci-002"
  | "text-curie-001"
  | "text-babbage-001"
  | "text-ada-001"
  | "davinci"
  | "curie"
  | "babbage"
  | "ada";

export async function generateCompletion({
  apiKey,
  prompt,
  model,
  n,
  temperature,
  maxTokens,
  presencePenalty,
  frequencyPenalty,
}: {
  apiKey: string;
  prompt: string;
  model: OpenAICompletionModel;
  n?: number;
  temperature?: number;
  maxTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
}): Promise<OpenAICompletion> {
  const response = await axios.post(
    "https://api.openai.com/v1/completions",
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

  return OpenAICompletionSchema.parse(response.data);
}
