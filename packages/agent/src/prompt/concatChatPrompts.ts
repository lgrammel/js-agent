import { OpenAIChatMessage } from "../provider/openai/api/OpenAIChatCompletion";
import { ChatPrompt } from "./Prompt";

// Convenience function overloads for combining multiple chat prompts into one.
// TypeScripts type inference (5.0) does not work well for merging multiple generics
// if only the last overload is provided, so we provide a few overloads to make
// it easier to use.
export function concatChatPrompts<INPUT1, INPUT2>(
  prompt1: ChatPrompt<INPUT1>,
  prompt2: ChatPrompt<INPUT2>
): ChatPrompt<INPUT1 | INPUT2>;
export function concatChatPrompts<INPUT1, INPUT2, INPUT3>(
  prompt1: ChatPrompt<INPUT1>,
  prompt2: ChatPrompt<INPUT2>,
  prompt3: ChatPrompt<INPUT3>
): ChatPrompt<INPUT1 | INPUT2 | INPUT3>;
export function concatChatPrompts<INPUT1, INPUT2, INPUT3, INPUT4>(
  prompt1: ChatPrompt<INPUT1>,
  prompt2: ChatPrompt<INPUT2>,
  prompt3: ChatPrompt<INPUT3>,
  prompt4: ChatPrompt<INPUT4>
): ChatPrompt<INPUT1 | INPUT2 | INPUT3 | INPUT4>;
export function concatChatPrompts<INPUT1, INPUT2, INPUT3, INPUT4, INPUT5>(
  prompt1: ChatPrompt<INPUT1>,
  prompt2: ChatPrompt<INPUT2>,
  prompt3: ChatPrompt<INPUT3>,
  prompt4: ChatPrompt<INPUT4>,
  prompt5: ChatPrompt<INPUT5>
): ChatPrompt<INPUT1 | INPUT2 | INPUT3 | INPUT4 | INPUT5>;
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
