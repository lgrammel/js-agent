import { ai } from "..";
import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { retryWithExponentialBackoff } from "../util/retryWithExponentialBackoff";
import { calculateCallCostInMillicent } from "./calculateCallCostInMillicent";

export type TextGenerationResult =
  | {
      success: true;
      generatedText: string;
      metadata: {
        model: string;
        startEpochSeconds: number;
        durationInMs: number;
        tries: number;
        costInMilliCent: number;
      };
    }
  | {
      success: false;
      error: unknown;
      metadata: {
        model: string;
        startEpochSeconds: number;
        durationInMs: number;
        tries: number;
      };
    };

export function createGenerateGpt4Completion({
  openaiApiKey,
}: {
  openaiApiKey: string;
}) {
  return async function generateGpt4Completion({
    messages,
    maxTokens,
  }: {
    messages: Array<OpenAIChatMessage>;
    maxTokens?: number;
  }): Promise<TextGenerationResult> {
    const model = "gpt-4";

    const startTime = performance.now();
    const startEpochSeconds = Math.floor(
      (performance.timeOrigin + startTime) / 1000
    );

    const response = await retryWithExponentialBackoff(() =>
      ai.openai.createChatCompletion({
        apiKey: openaiApiKey,
        messages,
        model,
        temperature: 0,
        maxTokens,
      })
    );

    const textGenerationDurationInMs = Math.ceil(performance.now() - startTime);

    if (!response.success) {
      return {
        success: false,
        error: response.error,
        metadata: {
          model,
          startEpochSeconds,
          durationInMs: textGenerationDurationInMs,
          tries: response.tries,
        },
      };
    }

    return {
      success: true,
      generatedText: response.result.choices[0].message.content,
      metadata: {
        model,
        startEpochSeconds,
        durationInMs: textGenerationDurationInMs,
        tries: response.tries,
        costInMilliCent: calculateCallCostInMillicent({
          model,
          usage: response.result.usage,
        }),
      },
    };
  };
}
