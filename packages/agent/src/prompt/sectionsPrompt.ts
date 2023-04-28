import { OpenAIChatMessage } from "../provider/openai/OpenAIChatCompletion";
import { chatPromptFromTextPrompt } from "./chatPromptFromTextPrompt";
import { formatSectionAsMarkdown } from "./formatSectionAsMarkdown";
import { FormatSectionFunction } from "./FormatSectionFunction";
import { ChatPrompt, TextPrompt } from "./Prompt";
import { Section } from "./Section";

export const sectionsTextPrompt =
  <INPUT>({
    sectionSeparator = "\n\n",
    format = formatSectionAsMarkdown,
    getSections,
  }: {
    sectionSeparator?: string;
    format?: FormatSectionFunction;
    getSections: (input: INPUT) => PromiseLike<Array<Section>>;
  }): TextPrompt<INPUT> =>
  async (input: INPUT) =>
    (await getSections(input)).map(format).join(sectionSeparator);

export const sectionsChatPrompt = <INPUT>({
  role,
  sectionSeparator,
  format,
  getSections,
}: {
  role: OpenAIChatMessage["role"];
  sectionSeparator?: string;
  format?: FormatSectionFunction;
  getSections: (input: INPUT) => PromiseLike<Array<Section>>;
}): ChatPrompt<INPUT> =>
  chatPromptFromTextPrompt({
    role,
    textPrompt: sectionsTextPrompt({
      sectionSeparator,
      format,
      getSections,
    }),
  });
