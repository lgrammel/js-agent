import { Run } from "../agent";
import { Step } from "./Step";
import { StepResult } from "./StepResult";
import {
  GeneratorModel,
  generate as generateFunction,
} from "../text/generate/generate";
import { Prompt } from "../prompt/Prompt";
import { RunContext } from "../agent/RunContext";

export class PromptStep<INPUT, PROMPT_TYPE> extends Step {
  private readonly generateText: (
    _0: INPUT,
    _1: RunContext
  ) => PromiseLike<string>;
  private readonly input: INPUT;

  constructor({
    type = "prompt",
    run,
    prompt,
    model,
    input,
  }: {
    type?: string;
    run: Run;
    prompt: Prompt<INPUT, PROMPT_TYPE>;
    model: GeneratorModel<PROMPT_TYPE, any, string>;
    input: INPUT;
  }) {
    super({ type, run });

    this.input = input;
    this.generateText = generateFunction({
      id: `step/${this.id}/generate-text`,
      prompt,
      model,
      processOutput: async (output) => output,
    });
  }

  protected async _execute(): Promise<StepResult> {
    const generatedText = (
      await this.generateText(this.input, this.run)
    ).trim();

    return {
      type: "succeeded",
      summary: generatedText,
    };
  }
}
