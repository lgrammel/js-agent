import { GeneratorModel } from "../../text/generate/generate";
import {
  OpenAICompletion,
  OpenAICompletionModel,
  generateCompletion,
} from "./api/generateCompletion";

export const completionModel = ({
  apiKey,
  model,
  temperature = 0,
  maxTokens,
}: {
  apiKey: string;
  model: OpenAICompletionModel;
  temperature?: number;
  maxTokens?: number;
}): GeneratorModel<string, OpenAICompletion, string> => ({
  vendor: "openai",
  name: model,
  generate: async (input: string): Promise<OpenAICompletion> =>
    generateCompletion({
      apiKey,
      prompt: input,
      model,
      temperature,
      maxTokens,
    }),
  extractOutput: async (rawOutput: OpenAICompletion): Promise<string> => {
    return rawOutput.choices[0].text;
  },
});
