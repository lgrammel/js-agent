import { OpenAIChatMessage } from "../provider/openai/api/OpenAIChatCompletion";

export type GenerateChatCompletionFunction = (parameters: {
  messages: Array<OpenAIChatMessage>;
}) => PromiseLike<string>;
