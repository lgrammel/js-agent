import { OpenAIChatMessage } from "../provider/openai/OpenAIChatMessage";

export type Prompt<INPUT, PROMPT_TYPE> = (
  input: INPUT
) => PromiseLike<PROMPT_TYPE>;

export type ChatPrompt<INPUT> = Prompt<INPUT, Array<OpenAIChatMessage>>;

export type TextPrompt<INPUT> = Prompt<INPUT, string>;
