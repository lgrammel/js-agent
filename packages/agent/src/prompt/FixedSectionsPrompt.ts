import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { Section } from "./Section";
import { SectionFormatter } from "./SectionFormatter";
import { SectionPrompt } from "./SectionPrompt";

export class FixedSectionsPrompt extends SectionPrompt<unknown> {
  readonly sections: Array<Section>;

  constructor({
    sections,
    formatter,
    role,
  }: {
    sections: Array<Section>;
    formatter?: SectionFormatter;
    role?: OpenAIChatMessage["role"];
  }) {
    super({ formatter, role });

    if (sections == null) {
      throw new Error("instructions is required");
    }

    this.sections = sections;
  }

  async getSections(): Promise<Array<Section>> {
    return this.sections;
  }
}
