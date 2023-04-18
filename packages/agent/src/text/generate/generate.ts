import { Prompt } from "../../prompt/Prompt";

export function generate<INPUT, PROMPT_TYPE, OUTPUT>({
  prompt,
  generate,
  processOutput,
}: {
  prompt: Prompt<INPUT, PROMPT_TYPE>;
  generate: (value: PROMPT_TYPE) => PromiseLike<string>;
  processOutput: (output: string) => PromiseLike<OUTPUT>;
}) {
  return async (input: INPUT) =>
    processOutput(await generate(await prompt(input)));
}
