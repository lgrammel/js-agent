import { OpenAIChatMessage } from "../ai/openai/OpenAIChatMessage";

export type GenerateChatCompletionFunction = (parameters: {
  messages: Array<OpenAIChatMessage>;
}) => PromiseLike<string>;
