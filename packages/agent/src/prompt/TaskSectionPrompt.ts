import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { Section } from "./Section";
import { SectionFormatter } from "./SectionFormatter";
import { SectionPrompt } from "./SectionPrompt";

export class TaskSectionPrompt extends SectionPrompt<{
  task: string;
}> {
  constructor({
    formatter,
    role = "user",
  }: {
    formatter?: SectionFormatter;
    role?: OpenAIChatMessage["role"];
  } = {}) {
    super({ formatter, role });
  }

  async getSections({ task }: { task: string }): Promise<Array<Section>> {
    return [
      {
        title: "Task",
        content: task,
      },
    ];
  }
}
