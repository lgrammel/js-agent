import { chatPromptFromTextPrompt } from "./chatPromptFromTextPrompt";
import { sectionsTextPrompt } from "./sectionsPrompt";

export const taskPromptSections = async ({ task }: { task: string }) => [
  {
    title: "Task",
    content: task,
  },
];

export const taskTextPrompt = () =>
  sectionsTextPrompt({
    getSections: taskPromptSections,
  });

export const taskChatPrompt = () =>
  chatPromptFromTextPrompt({
    role: "user",
    textPrompt: taskTextPrompt(),
  });
