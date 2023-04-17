import { OpenAIChatMessage } from "../ai/openai/OpenAIChatMessage";
import { FormatSectionFunction } from "./FormatSectionFunction";
import { Section } from "./Section";
import { sectionsChatPrompt } from "./sectionsChatPrompt";

export const fixedSectionsChatPrompt = ({
  sections,
  format,
  role,
}: {
  sections: Array<Section>;
  format?: FormatSectionFunction;
  role?: OpenAIChatMessage["role"];
}) =>
  sectionsChatPrompt({
    format,
    role,
    getSections: async () => sections,
  });
