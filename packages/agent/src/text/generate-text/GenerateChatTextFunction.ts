import { OpenAIChatMessage } from "../../ai/openai/createChatCompletion";

export type GenerateChatTextFunction = ({}: {
  messages: Array<OpenAIChatMessage>;
}) => PromiseLike<string>;
