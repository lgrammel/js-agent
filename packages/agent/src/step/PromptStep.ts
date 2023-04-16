import { AgentRun } from "../agent";
import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { GenerateChatTextFunction } from "../component/generate-text";
import { Step } from "./Step";
import { StepResult } from "./StepResult";

export class PromptStep extends Step {
  private readonly generateText: GenerateChatTextFunction;
  private readonly messages: OpenAIChatMessage[];

  constructor({
    type = "prompt",
    run,
    generateText,
    messages,
  }: {
    type?: string;
    run: AgentRun;
    generateText: GenerateChatTextFunction;
    messages: OpenAIChatMessage[];
  }) {
    super({ type, run });

    this.generateText = generateText;
    this.messages = messages;
  }

  protected async _execute(): Promise<StepResult> {
    const generatedText = (
      await this.generateText({
        messages: this.messages,
      })
    ).trim();

    return {
      type: "succeeded",
      summary: generatedText,
    };
  }
}
