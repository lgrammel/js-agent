import { ActionRegistry } from "../action/ActionRegistry";
import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { ChatTextGenerator } from "../component/text-generator/ChatTextGenerator";
import { ErrorStep } from "./ErrorStep";
import { NextStepGenerator } from "./NextStepGenerator";
import { NoopStep } from "./NoopStep";
import { Step } from "./Step";
import { AgentRun } from "../agent/AgentRun";

export class BasicNextStepGenerator implements NextStepGenerator {
  readonly role: string;
  readonly constraints: string;
  readonly actionRegistry: ActionRegistry;
  readonly textGenerator: ChatTextGenerator;

  constructor({
    role,
    constraints,
    actionRegistry,
    textGenerator,
  }: {
    role: string;
    constraints: string;
    actionRegistry: ActionRegistry;
    textGenerator: ChatTextGenerator;
  }) {
    if (role == null) {
      throw new Error("role is required");
    }
    if (constraints == null) {
      throw new Error("constraints is required");
    }
    if (actionRegistry == null) {
      throw new Error("actionRegistry is required");
    }
    if (textGenerator == null) {
      throw new Error("textGenerator is required");
    }

    this.role = role;
    this.constraints = constraints;
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
    const messages: Array<OpenAIChatMessage> = [
      {
        role: "system",
        content: `## ROLE
${this.role}

## CONSTRAINTS
${this.constraints};

## AVAILABLE ACTIONS
${this.actionRegistry.getAvailableActionInstructions()}`,
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
