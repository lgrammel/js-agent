import { AgentRun } from "../agent";
import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { ChatTextGenerator } from "../component/text-generator/ChatTextGenerator";
import { Step } from "./Step";
import { StepResult } from "./StepResult";

export class PromptStep extends Step {
  private readonly textGenerator: ChatTextGenerator;
  private readonly messages: OpenAIChatMessage[];
  private readonly maxTokens?: number;
  private readonly temperature?: number;

  constructor({
    type = "prompt",
    run,
    textGenerator,
    messages,
    maxTokens,
    temperature,
  }: {
    type?: string;
    run: AgentRun;
    textGenerator: ChatTextGenerator;
    messages: OpenAIChatMessage[];
    maxTokens?: number;
    temperature?: number;
  }) {
    super({ type, run });

    this.textGenerator = textGenerator;
    this.messages = messages;
    this.maxTokens = maxTokens;
    this.temperature = temperature;
  }

  protected async _execute(): Promise<StepResult> {
    const generatedText = (
      await this.textGenerator.generateText({
        messages: this.messages,
        maxTokens: this.maxTokens,
        temperature: this.temperature,
      })
    ).trim();

    return {
      type: "succeeded",
      summary: generatedText,
    };
  }
}
