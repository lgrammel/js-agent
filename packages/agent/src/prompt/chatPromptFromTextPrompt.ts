import { OpenAIChatMessage } from "../api/openai/OpenAIChatCompletion";
import { ChatPrompt, TextPrompt } from "./Prompt";

export const chatPromptFromTextPrompt =
  <INPUT>({
    textPrompt,
    role,
  }: {
    textPrompt: TextPrompt<INPUT>;
    role: OpenAIChatMessage["role"];
  }): ChatPrompt<INPUT> =>
  async (input: INPUT): Promise<Array<OpenAIChatMessage>> =>
    [{ role, content: await textPrompt(input) }];
