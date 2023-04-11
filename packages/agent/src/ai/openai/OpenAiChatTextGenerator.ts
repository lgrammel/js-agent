import {
  OpenAIChatCompletionModel,
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

export class OpenAiChatTextGenerator implements ChatTextGenerator {
  private readonly apiKey: string;
  private readonly recordTextGeneration?: ({}: {
    result: TextGenerationResult;
  }) => void;
  private readonly model: OpenAIChatCompletionModel;

  constructor({
    apiKey,
    model,
    recordTextGeneration,
  }: {
    apiKey: string;
    model: OpenAIChatCompletionModel;
    recordTextGeneration?: ({}: { result: TextGenerationResult }) => void;
  }) {
    if (apiKey == null) {
      throw new Error("apiKey is required");
    }
    if (model == null) {
      throw new Error("model is required");
    }

    this.apiKey = apiKey;
    this.model = model;
    this.recordTextGeneration = recordTextGeneration;
  }

  async generateText({
    messages,
    maxTokens,
    temperature = 0,
  }: {
    messages: OpenAIChatMessage[];
    maxTokens?: number;
    temperature?: number;
  }): // context: unknown TODO switch to LLMCallRecorder
  Promise<string> {
    const startTime = performance.now();
    const startEpochSeconds = Math.floor(
      (performance.timeOrigin + startTime) / 1000
    );

    const response = await retryWithExponentialBackoff(() =>
      createChatCompletion({
        apiKey: this.apiKey,
        messages,
        model: this.model,
        temperature,
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
            model: this.model,
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
          model: this.model,
          startEpochSeconds,
          durationInMs: textGenerationDurationInMs,
          tries: response.tries,
          costInMilliCent: calculateCallCostInMillicent({
            model: this.model,
            usage: response.result.usage,
          }),
        },
      },
    });

    return generatedText;
  }
}
