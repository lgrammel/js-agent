import { ActionRegistry } from "../action";
import { chatPromptFromTextPrompt } from "./chatPromptFromTextPrompt";
import { sectionsTextPrompt } from "./sectionsPrompt";

export const availableActionsSections = async ({
  actions,
}: {
  actions: ActionRegistry<unknown>;
}) => [
  {
    title: "Available Actions",
    content: actions.getAvailableActionInstructions(),
  },
];

export const availableActionsTextPrompt = () =>
  sectionsTextPrompt({
    getSections: availableActionsSections,
  });

export const availableActionsChatPrompt = () =>
  chatPromptFromTextPrompt({
    role: "system",
    textPrompt: availableActionsTextPrompt(),
  });
