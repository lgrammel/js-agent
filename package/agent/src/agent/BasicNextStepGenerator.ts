import { ActionRegistry } from "../action/ActionRegistry";
import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { ChatTextGenerator } from "../component/text-generator/ChatTextGenerator";
import { ErrorStep } from "../step/ErrorStep";
import { NextStepGenerator } from "../step/NextStepGenerator";
import { NoopStep } from "../step/NoopStep";
import { Step } from "../step/Step";
import { AgentRun } from "./AgentRun";

export class BasicNextStepGenerator implements NextStepGenerator {
  readonly actionRegistry: ActionRegistry;
  readonly textGenerator: ChatTextGenerator;

  constructor({
    actionRegistry,
    textGenerator,
  }: {
    actionRegistry: ActionRegistry;
    textGenerator: ChatTextGenerator;
  }) {
    if (actionRegistry == null) {
      throw new Error("actionRegistry is required");
    }
    if (textGenerator == null) {
      throw new Error("textGenerator is required");
    }

    this.actionRegistry = actionRegistry;
    this.textGenerator = textGenerator;
  }

  async generateNextStep({
    completedSteps,
    run,
  }: {
    completedSteps: Array<Step>;
    run: AgentRun;
  }): Promise<Step> {
    const agent = run.agent;

    const messages: Array<OpenAIChatMessage> = [
      {
        role: "system",
        content: `## ROLE
${agent.role}

## CONSTRAINTS
${agent.constraints};

## AVAILABLE ACTIONS
${agent.actionRegistry.getAvailableActionInstructions()}`,
      },
      { role: "user", content: `## TASK\n${run.instructions}` },
    ];

    // TODO result formatting etc. (more complex prompt generator)
    for (const step of completedSteps) {
      const stepState = step.state;

      if (step.generatedText != null) {
        messages.push({
          role: "assistant",
          content: step.generatedText,
        });
      }

      switch (stepState.type) {
        case "failed": {
          messages.push({
            role: "system",
            content: `ERROR:\n${stepState.summary}`,
          });
          break;
        }
        case "succeeded": {
          if (stepState.output == null) {
            break;
          }

          messages.push({
            role: "system",
            content: JSON.stringify(stepState.output),
          });
          break;
        }
      }
    }

    run.observer?.onStepGenerationStarted({
      run,
      messages,
    });

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

    run.observer?.onStepGenerationFinished({
      run,
      generatedText,
      step,
    });

    return step;
  }
}
