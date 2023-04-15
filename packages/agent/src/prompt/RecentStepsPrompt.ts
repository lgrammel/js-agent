import { OpenAIChatMessage } from "../ai/openai";
import { Step } from "../step";
import { ToolStep } from "../tool/ToolStep";
import { Prompt } from "./Prompt";

export class RecentStepsPrompt
  implements Prompt<{ completedSteps: Array<Step> }>
{
  readonly maxSteps: number;

  constructor({
    maxSteps = 10,
  }: {
    maxSteps?: number;
  } = {}) {
    this.maxSteps = maxSteps;
  }

  async generatePrompt({
    completedSteps,
    generatedTextsByStepId,
  }: {
    completedSteps: Array<Step>;
    generatedTextsByStepId: Map<string, string>;
  }): Promise<OpenAIChatMessage[]> {
    const messages: OpenAIChatMessage[] = [];

    for (const step of completedSteps.slice(-this.maxSteps)) {
      // repeat the original agent response to reinforce the action format and keep the conversation going:
      const generatedText = generatedTextsByStepId.get(step.id);
      if (generatedText != null) {
        messages.push({
          role: "assistant",
          content: generatedText,
        });
      }

      let content: string | undefined = undefined;

      const stepState = step.state;
      switch (stepState.type) {
        case "failed": {
          content = `ERROR:\n${stepState.summary}`;
          break;
        }
        case "succeeded": {
          if (step instanceof ToolStep) {
            content = step.action.formatResult({
              input: stepState.input,
              output: stepState.output,
              summary: stepState.summary,
            });
            break;
          }
        }
      }

      if (content != null) {
        messages.push({
          role: "system",
          content,
        });
      }
    }

    return messages;
  }
}
