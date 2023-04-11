import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { Prompt } from "./Prompt";

export class CompositePrompt<CONTEXT> implements Prompt<CONTEXT> {
  private prompts: Array<Prompt<CONTEXT>>;

  constructor(...prompts: Array<Prompt<CONTEXT>>) {
    this.prompts = prompts;
  }

  async generatePrompt(context: CONTEXT): Promise<Array<OpenAIChatMessage>> {
    const messages: Array<OpenAIChatMessage> = [];
    for (const prompt of this.prompts) {
      const promptMessages = await prompt.generatePrompt(context);
      messages.push(...promptMessages);
    }
    return messages;
  }
}
