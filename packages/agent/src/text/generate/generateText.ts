import { RunContext } from "../../agent/RunContext";
import { Prompt } from "../../prompt/Prompt";
import { GeneratorModel } from "./GeneratorModel";
import { generate } from "./generate";

export function generateText<INPUT, PROMPT_TYPE, RAW_OUTPUT>(
  {
    id,
    input,
    prompt,
    model,
    processOutput = async (output) => output.trim(),
  }: {
    id?: string | undefined;
    input: INPUT;
    prompt: Prompt<INPUT, PROMPT_TYPE>;
    model: GeneratorModel<PROMPT_TYPE, RAW_OUTPUT, string>;
    processOutput?: (output: string) => PromiseLike<string>;
  },
  context?: RunContext
) {
  return generate(
    {
      id,
      input,
      prompt,
      model,
      processOutput,
    },
    context
  );
}

generateText.asFunction =
  <INPUT, PROMPT_TYPE, RAW_OUTPUT>({
    id,
    prompt,
    model,
    processOutput,
  }: {
    id?: string | undefined;
    prompt: Prompt<INPUT, PROMPT_TYPE>;
    model: GeneratorModel<PROMPT_TYPE, RAW_OUTPUT, string>;
    processOutput?: (output: string) => PromiseLike<string>;
  }) =>
  async (input: INPUT, context: RunContext) =>
    generateText(
      {
        id,
        input,
        prompt,
        model,
        processOutput,
      },
      context
    );
