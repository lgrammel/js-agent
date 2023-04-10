import {
  OpenAIChatMessage,
  calculateCallCostInMillicent,
  createChatCompletion,
} from ".";
import { retryWithExponentialBackoff } from "../../util/retryWithExponentialBackoff";
import { ChatTextGenerator } from "../../component/text-generator/ChatTextGenerator";

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

export class Gpt4ChatTextGenerator implements ChatTextGenerator {
  private readonly apiKey: string;
  private readonly recordTextGeneration?: ({}: {
    result: TextGenerationResult;
  }) => void;

  constructor({
    apiKey,
    recordTextGeneration,
  }: {
    apiKey: string;
    recordTextGeneration?: ({}: { result: TextGenerationResult }) => void;
  }) {
    if (apiKey == null) {
      throw new Error("apiKey is required");
    }
    this.apiKey = apiKey;
    this.recordTextGeneration = recordTextGeneration;
  }

  async generateText(
    {
      messages,
      maxTokens,
    }: { messages: OpenAIChatMessage[]; maxTokens?: number | undefined },
    context: unknown
  ): Promise<string> {
    const model = "gpt-4";

    const startTime = performance.now();
    const startEpochSeconds = Math.floor(
      (performance.timeOrigin + startTime) / 1000
    );

    const response = await retryWithExponentialBackoff(() =>
      createChatCompletion({
        apiKey: this.apiKey,
        messages,
        model,
        temperature: 0,
        maxTokens,
      })
    );

    const textGenerationDurationInMs = Math.ceil(performance.now() - startTime);

    if (!response.success) {
      this.recordTextGeneration?.({
        result: {
          success: false,
          error: response.error,
          metadata: {
            model,
            startEpochSeconds,
            durationInMs: textGenerationDurationInMs,
            tries: response.tries,
          },
        },
      });

      throw response.error; // TODO wrap error
    }

    const generatedText = response.result.choices[0].message.content;

    this.recordTextGeneration?.({
      result: {
        success: true,
        generatedText,
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
      },
    });

    return generatedText;
  }
}
