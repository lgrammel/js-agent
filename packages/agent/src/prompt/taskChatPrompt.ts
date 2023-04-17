import { OpenAIChatMessage } from "../ai/openai/OpenAIChatMessage";
import { FormatSectionFunction } from "./FormatSectionFunction";
import { sectionsChatPrompt } from "./sectionsChatPrompt";

export const taskChatPrompt = ({
  format,
  role = "user",
}: {
  format?: FormatSectionFunction;
  role?: OpenAIChatMessage["role"];
} = {}) =>
  sectionsChatPrompt({
    format,
    role,
    getSections: async ({ task }: { task: string }) => [
      {
        title: "Task",
        content: task,
      },
    ],
  });
