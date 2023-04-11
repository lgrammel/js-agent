import { ActionRegistry } from "../action";
import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { Section } from "./Section";
import { SectionFormatter } from "./SectionFormatter";
import { SectionPrompt } from "./SectionPrompt";

export class AvailableActionsSectionPrompt extends SectionPrompt<{
  actions: ActionRegistry;
}> {
  constructor({
    formatter,
    role,
  }: {
    formatter?: SectionFormatter;
    role?: OpenAIChatMessage["role"];
  } = {}) {
    super({ formatter, role });
  }

  async getSections({
    actions,
  }: {
    actions: ActionRegistry;
  }): Promise<Array<Section>> {
    return [
      {
        title: "Available Actions",
        content: actions.getAvailableActionInstructions(),
      },
    ];
  }
}
