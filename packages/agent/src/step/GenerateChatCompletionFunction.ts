import { OpenAIChatMessage } from "../api/openai/OpenAIChatCompletion";

export type GenerateChatCompletionFunction = (parameters: {
  messages: Array<OpenAIChatMessage>;
}) => PromiseLike<string>;
