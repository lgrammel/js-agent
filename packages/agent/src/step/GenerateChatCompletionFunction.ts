import { OpenAIChatMessage } from "../provider/openai/OpenAIChatCompletion";

export type GenerateChatCompletionFunction = (parameters: {
  messages: Array<OpenAIChatMessage>;
}) => PromiseLike<string>;
