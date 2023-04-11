import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { BasicSectionFormatter } from "./BasicSectionFormatter";
import { Prompt } from "./Prompt";
import { Section } from "./Section";
import { SectionFormatter } from "./SectionFormatter";

export abstract class SectionPrompt<CONTEXT> implements Prompt<CONTEXT> {
  readonly role: OpenAIChatMessage["role"];
  readonly formatter: SectionFormatter;

  constructor({
    formatter = new BasicSectionFormatter(),
    role = "system",
  }: {
    formatter?: SectionFormatter;
    role?: OpenAIChatMessage["role"];
  }) {
    this.formatter = formatter;
    this.role = role;
  }

  async generatePrompt(context: CONTEXT): Promise<Array<OpenAIChatMessage>> {
    return [
      {
        role: this.role,
        content: (await this.getSections(context))
          .map((section) => this.formatter.formatSection(section))
          .join("\n\n"),
      },
    ];
  }

  abstract getSections(context: CONTEXT): Promise<Array<Section>>;
}
