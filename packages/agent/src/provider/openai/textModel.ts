import { GeneratorModel } from "../../text/generate/generate";
import {
  OpenAITextCompletion,
  OpenAITextCompletionModel,
  generateTextCompletion,
} from "./api/generateTextCompletion";

export const completionModel = ({
  apiKey,
  model,
  temperature = 0,
  maxTokens,
}: {
  apiKey: string;
  model: OpenAITextCompletionModel;
  temperature?: number;
  maxTokens?: number;
}): GeneratorModel<string, OpenAITextCompletion, string> => ({
  vendor: "openai",
  name: model,
  generate: async (input: string): Promise<OpenAITextCompletion> =>
    generateTextCompletion({
      apiKey,
      prompt: input,
      model,
      temperature,
      maxTokens,
    }),
  extractOutput: async (rawOutput: OpenAITextCompletion): Promise<string> => {
    return rawOutput.choices[0].text;
  },
});
