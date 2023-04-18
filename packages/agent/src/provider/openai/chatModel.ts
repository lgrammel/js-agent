import { GeneratorModel } from "../../text";
import { OpenAIChatMessage } from "./OpenAIChatMessage";
import {
  OpenAIChatCompletion,
  OpenAIChatCompletionModel,
  generateChatCompletion,
} from "./api/generateChatCompletion";

export const chatModel = ({
  apiKey,
  model,
  temperature = 0,
  maxTokens,
}: {
  apiKey: string;
  model: OpenAIChatCompletionModel;
  temperature?: number;
  maxTokens?: number;
}): GeneratorModel<OpenAIChatMessage[], OpenAIChatCompletion, string> => ({
  vendor: "openai",
  name: model,
  generate: async (input: OpenAIChatMessage[]): Promise<OpenAIChatCompletion> =>
    generateChatCompletion({
      apiKey,
      messages: input,
      model,
      temperature,
      maxTokens,
    }),
  extractOutput: async (rawOutput: OpenAIChatCompletion): Promise<string> => {
    return rawOutput.choices[0].message.content;
  },
});
