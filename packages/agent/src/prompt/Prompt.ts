import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";

export interface Prompt<CONTEXT> {
  generatePrompt(context: CONTEXT): Promise<Array<OpenAIChatMessage>>;
}
