import { RunContext } from "../agent/RunContext";
import { Prompt } from "../prompt/Prompt";
import { retryWithExponentialBackoff } from "../util/retryWithExponentialBackoff";
import { trim } from "./trim";

export type GeneratorModel<PROMPT_TYPE, RAW_OUTPUT, GENERATED_OUTPUT> = {
  vendor: string;
  name: string;
  generate: (value: PROMPT_TYPE) => PromiseLike<RAW_OUTPUT>;
  extractOutput: (output: RAW_OUTPUT) => PromiseLike<GENERATED_OUTPUT>;
};

export function generate<
  INPUT,
  PROMPT_TYPE,
  RAW_OUTPUT,
  GENERATED_OUTPUT,
  OUTPUT
>({
  id,
  prompt,
  model,
  processOutput,
}: {
  id: string;
  prompt: Prompt<INPUT, PROMPT_TYPE>;
  model: GeneratorModel<PROMPT_TYPE, RAW_OUTPUT, GENERATED_OUTPUT>;
  processOutput: (output: GENERATED_OUTPUT) => PromiseLike<OUTPUT>;
}) {
  return async (input: INPUT, context: RunContext) => {
    const expandedPrompt = await prompt(input);

    const startTime = performance.now();
    const startEpochSeconds = Math.floor(
      (performance.timeOrigin + startTime) / 1000
    );

    const rawOutput = await retryWithExponentialBackoff(() =>
      model.generate(expandedPrompt)
    );

    const textGenerationDurationInMs = Math.ceil(performance.now() - startTime);

    const metadata = {
      id,
      model: {
        vendor: model.vendor,
        name: model.name,
      },
      startEpochSeconds,
      durationInMs: textGenerationDurationInMs,
      tries: rawOutput.tries,
    };

    if (!rawOutput.success) {
      context?.recordCall?.({
        type: "generate",
        success: false,
        metadata,
        input: expandedPrompt,
        error: rawOutput.error,
      });

      throw rawOutput.error; // TODO wrap error
    }

    const extractedOutput = await model.extractOutput(rawOutput.result);

    context?.recordCall?.({
      type: "generate",
      success: true,
      metadata,
      input: expandedPrompt,
      rawOutput: rawOutput.result,
      extractedOutput,
    });

    return processOutput(extractedOutput);
  };
}

export function generateText<INPUT, PROMPT_TYPE, RAW_OUTPUT>({
  id,
  prompt,
  model,
  processOutput = trim(),
}: {
  id: string;
  prompt: Prompt<INPUT, PROMPT_TYPE>;
  model: GeneratorModel<PROMPT_TYPE, RAW_OUTPUT, string>;
  processOutput?: (output: string) => PromiseLike<string>;
}) {
  return generate({
    id,
    prompt,
    model,
    processOutput,
  });
}
