import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";

export type GenerateChatCompletionFunction = (parameters: {
  messages: Array<OpenAIChatMessage>;
}) => PromiseLike<string>;
