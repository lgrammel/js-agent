import { Prompt } from "../../prompt/Prompt";

export function generate<INPUT, PROMPT_TYPE>({
  prompt,
  generate,
}: {
  prompt: Prompt<INPUT, PROMPT_TYPE>;
  generate: (value: PROMPT_TYPE) => PromiseLike<string>;
}) {
  return async (input: INPUT) => generate(await prompt(input));
}
