import zod from "zod";
import { ResultFormatter } from "../action/ResultFormatter";
import { OpenAIChatMessage } from "../ai/openai";
import { Step } from "../step";
import { Prompt } from "./Prompt";
import { ResultFormatterRegistry } from "../action/ResultFormatterRegistry";

export class RecentStepsPrompt
  implements Prompt<{ completedSteps: Array<Step> }>
{
  readonly maxSteps: number;
  readonly resultFormatters: ResultFormatterRegistry;

  constructor({
    maxSteps = 10,
    resultFormatters = new ResultFormatterRegistry(),
  }: {
    maxSteps?: number;
    resultFormatters?: ResultFormatterRegistry;
  } = {}) {
    this.maxSteps = maxSteps;
    this.resultFormatters = resultFormatters;
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
          if (stepState.output == null) {
            break;
          }

          const resultFormatter = this.resultFormatters.getFormatter(step.type);

          if (resultFormatter == null) {
            content = JSON.stringify(stepState.output);
            break;
          }

          content = this.formatOutput({
            resultFormatter,
            result: stepState,
          });
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

  private formatOutput<OUTPUT>({
    resultFormatter,
    result,
  }: {
    result: unknown;
    resultFormatter: ResultFormatter<OUTPUT>;
  }) {
    const schema = zod.object({
      output: resultFormatter.outputSchema,
      summary: zod.string(),
    });

    const parsedResult = schema.parse(result);

    return resultFormatter.formatResult({
      result: {
        summary: parsedResult.summary,
        output: parsedResult.output as any, // TODO fix type issue
      },
    });
  }
}
