import { OpenAIChatMessage } from "../provider/openai/api/OpenAIChatCompletion";
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
