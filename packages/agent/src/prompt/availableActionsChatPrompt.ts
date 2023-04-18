import { ActionRegistry } from "../action";
import { OpenAIChatMessage } from "../provider/openai/OpenAIChatMessage";
import { FormatSectionFunction } from "./FormatSectionFunction";
import { sectionsChatPrompt } from "./sectionsChatPrompt";

export const availableActionsChatPrompt = ({
  format,
  role,
}: {
  format?: FormatSectionFunction;
  role?: OpenAIChatMessage["role"];
} = {}) =>
  sectionsChatPrompt({
    format,
    role,
    getSections: async ({ actions }: { actions: ActionRegistry }) => {
      return [
        {
          title: "Available Actions",
          content: actions.getAvailableActionInstructions(),
        },
      ];
    },
  });
