import { OpenAIChatMessage } from "../provider/openai/OpenAIChatMessage";
import { formatSectionAsMarkdown } from "./formatSectionAsMarkdown";
import { FormatSectionFunction } from "./FormatSectionFunction";
import { ChatPrompt } from "./Prompt";
import { Section } from "./Section";

export function sectionsChatPrompt<INPUT>({
  format = formatSectionAsMarkdown,
  role = "system",
  getSections,
}: {
  format?: FormatSectionFunction;
  role?: OpenAIChatMessage["role"];
  getSections: (input: INPUT) => PromiseLike<Array<Section>>;
}): ChatPrompt<INPUT> {
  return async (input: INPUT) => {
    return [
      {
        role,
        content: (await getSections(input)).map(format).join("\n\n"),
      },
    ];
  };
}
