import { OpenAIChatMessage } from "../provider/openai/OpenAIChatMessage";

export type GenerateChatCompletionFunction = (parameters: {
  messages: Array<OpenAIChatMessage>;
}) => PromiseLike<string>;
