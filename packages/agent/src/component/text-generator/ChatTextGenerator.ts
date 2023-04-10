import { OpenAIChatMessage } from "../../ai/openai/createChatCompletion";

export interface ChatTextGenerator {
  generateText(
    {}: { messages: Array<OpenAIChatMessage>; maxTokens?: number },
    context: unknown
  ): PromiseLike<string>;
}
