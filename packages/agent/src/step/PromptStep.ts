import { AgentRun } from "../agent";
import { Step } from "./Step";
import { StepResult } from "./StepResult";
import { generate as generateFunction } from "../text/generate/generate";
import { Prompt } from "../prompt/Prompt";

export class PromptStep<INPUT, PROMPT_TYPE> extends Step {
  private readonly generateText: (input: INPUT) => PromiseLike<string>;
  private readonly input: INPUT;

  constructor({
    type = "prompt",
    run,
    prompt,
    generate,
    input,
  }: {
    type?: string;
    run: AgentRun;
    prompt: Prompt<INPUT, PROMPT_TYPE>;
    generate: (value: PROMPT_TYPE) => PromiseLike<string>;
    input: INPUT;
  }) {
    super({ type, run });

    this.input = input;
    this.generateText = generateFunction({
      prompt,
      generate,
    });
  }

  protected async _execute(): Promise<StepResult> {
    const generatedText = (await this.generateText(this.input)).trim();

    return {
      type: "succeeded",
      summary: generatedText,
    };
  }
}
