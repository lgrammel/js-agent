import { Run } from "../agent";
import { RunContext } from "../agent/RunContext";
import { Prompt } from "../prompt/Prompt";
import { generateText } from "../text/generate/generateText";
import { GeneratorModel } from "../text/generate/GeneratorModel";
import { Step } from "./Step";
import { StepResult } from "./StepResult";

export class PromptStep<INPUT, PROMPT_TYPE, RUN_STATE> extends Step<RUN_STATE> {
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
    run: Run<RUN_STATE>;
    prompt: Prompt<INPUT, PROMPT_TYPE>;
    model: GeneratorModel<PROMPT_TYPE, any, string>;
    input: INPUT;
  }) {
    super({ type, run });

    this.input = input;
    this.generateText = generateText.asFunction({
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
