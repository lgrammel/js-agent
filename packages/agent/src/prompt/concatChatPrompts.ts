import { OpenAIChatMessage } from "../ai/openai/OpenAIChatMessage";
import { ChatPrompt } from "./Prompt";

export function concatChatPrompts<INPUT>(...prompts: Array<ChatPrompt<INPUT>>) {
  return async (input: INPUT): Promise<Array<OpenAIChatMessage>> => {
    const messages: Array<OpenAIChatMessage> = [];
    for (const prompt of prompts) {
      const promptMessages = await prompt(input);
      messages.push(...promptMessages);
    }
    return messages;
  };
}
