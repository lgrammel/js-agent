import { OpenAIChatMessage } from "../../ai/openai/OpenAIChatMessage";
import { Prompt } from "../../prompt/Prompt";

export const SummarizeChatPrompt: Prompt<
  {
    text: string;
    topic: string;
  },
  Array<OpenAIChatMessage>
> = async ({ text, topic }) => [
  {
    role: "system",
    content: `## ROLE
You are an expert at summarizing texts.
You need to extract and keep all the information on a specific topic from the text.`,
  },
  {
    role: "user",
    content: `## TOPIC\n${topic}`,
  },
  {
    role: "user",
    content: `## TEXT\n${text}`,
  },
];
