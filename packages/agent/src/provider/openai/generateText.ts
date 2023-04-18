import { retryWithExponentialBackoff } from "../../util/retryWithExponentialBackoff";
import {
  OpenAICompletionModel,
  generateCompletion,
} from "./api/generateCompletion";

export const generateText =
  ({
    apiKey,
    model,
    temperature = 0,
    maxTokens,
  }: {
    apiKey: string;
    model: OpenAICompletionModel;
    temperature?: number;
    maxTokens?: number;
  }) =>
  async (prompt: string): Promise<string> => {
    const response = await retryWithExponentialBackoff(() =>
      generateCompletion({
        apiKey,
        prompt,
        model,
        temperature,
        maxTokens,
      })
    );

    if (!response.success) {
      throw response.error; // TODO wrap error
    }

    return response.result.choices[0].text;
  };
