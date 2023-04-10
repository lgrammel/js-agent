import zod from "zod";
import { ActionRegistry } from "../action/ActionRegistry";
import { ResultFormatter } from "../action/ResultFormatter";
import { ResultFormatterRegistry } from "../action/ResultFormatterRegistry";
import { AgentRun } from "../agent/AgentRun";
import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { ChatTextGenerator } from "../component/text-generator/ChatTextGenerator";
import { ErrorStep } from "./ErrorStep";
import { NextStepGenerator } from "./NextStepGenerator";
import { NoopStep } from "./NoopStep";
import { Step } from "./Step";
import { InstructionSection } from "./InstructionSection";

export class BasicNextStepGenerator implements NextStepGenerator {
  readonly instructionSections: Array<InstructionSection>;
  readonly actionRegistry: ActionRegistry;
  readonly textGenerator: ChatTextGenerator;
  readonly resultFormatterRegistry: ResultFormatterRegistry;
  readonly stepRetention: number;

  constructor({
    instructionSections,
    actionRegistry,
    textGenerator,
    resultFormatterRegistry = new ResultFormatterRegistry(),
    stepRetention = 10,
  }: {
    instructionSections: Array<InstructionSection>;
    actionRegistry: ActionRegistry;
    textGenerator: ChatTextGenerator;
    resultFormatterRegistry?: ResultFormatterRegistry;
    stepRetention?: number;
  }) {
    if (instructionSections == null) {
      throw new Error("sections is required");
    }
    if (actionRegistry == null) {
      throw new Error("actionRegistry is required");
    }
    if (textGenerator == null) {
      throw new Error("textGenerator is required");
    }

    this.instructionSections = instructionSections;
    this.actionRegistry = actionRegistry;
    this.textGenerator = textGenerator;
    this.resultFormatterRegistry = resultFormatterRegistry;
    this.stepRetention = stepRetention;
  }

  generateMessages({
    completedSteps,
    run,
  }: {
    completedSteps: Array<Step>;
    run: AgentRun;
  }): Array<OpenAIChatMessage> {
    const messages: Array<OpenAIChatMessage> = [
      {
        role: "system",
        content: this.instructionSections
          .map((section) => `## ${section.title}\n${section.content}`)
          .join("\n\n"),
      },
      {
        role: "system",
        content: `## AVAILABLE ACTIONS\n${this.actionRegistry.getAvailableActionInstructions()}`,
      },
      { role: "user", content: `## TASK\n${run.instructions}` },
    ];

    for (const step of completedSteps.slice(-this.stepRetention)) {
      // repeat the original agent response to reinforce the action format and keep the conversation going:
      if (step.generatedText != null) {
        messages.push({
          role: "assistant",
          content: step.generatedText,
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

          const resultFormatter = this.resultFormatterRegistry.getFormatter(
            step.type
          );

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

  async generateNextStep({
    completedSteps,
    run,
  }: {
    completedSteps: Array<Step>;
    run: AgentRun;
  }): Promise<Step> {
    const messages = this.generateMessages({ completedSteps, run });

    try {
      run.observer?.onStepGenerationStarted({ run, messages });
    } catch (error: any) {
      console.error(error); //TODO logger
    }

    const generatedText = await this.textGenerator.generateText(
      { messages },
      run
    );

    const actionParameters = this.actionRegistry.format.parse(generatedText);

    let step: Step;
    if (actionParameters.action == null) {
      step = new NoopStep({
        type: "thought",
        generatedText,
        summary: actionParameters._freeText,
      });
    } else {
      try {
        const action = this.actionRegistry.getAction(actionParameters.action);

        step = await action.createStep({
          generatedText,
          input: actionParameters,
        });
      } catch (error: any) {
        step = new ErrorStep({
          generatedText,
          error,
        });
      }
    }

    try {
      run.observer?.onStepGenerationFinished({ run, generatedText, step });
    } catch (error: any) {
      console.error(error); //TODO logger
    }

    return step;
  }
}
