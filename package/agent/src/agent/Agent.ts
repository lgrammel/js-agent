import { ActionRegistry } from "../action/ActionRegistry";
import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { ChatTextGenerator } from "../component/text-generator/ChatTextGenerator";
import { DynamicCompositeStep } from "../step/DynamicCompositeStep";
import { ErrorStep } from "../step/ErrorStep";
import { MaxStepAbortController } from "../step/MaxStepAbortController";
import { NoopStep } from "../step/NoopStep";
import { Step } from "../step/Step";
import { AgentRun } from "./AgentRun";
import { AgentRunObserver } from "./AgentRunObserver";

export class Agent {
  readonly name: string;
  readonly role: string;
  readonly constraints: string;
  readonly actionRegistry: ActionRegistry;
  readonly textGenerator: ChatTextGenerator;

  constructor({
    name,
    role,
    constraints,
    actionRegistry,
    textGenerator,
  }: {
    name: string;
    role: string;
    constraints: string;
    actionRegistry: ActionRegistry;
    textGenerator: ChatTextGenerator;
  }) {
    if (name == null) {
      throw new Error("name is required");
    }
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

    this.name = name;
    this.role = role;
    this.constraints = constraints;
    this.actionRegistry = actionRegistry;
    this.textGenerator = textGenerator;
  }

  async run({
    instructions,
    observer,
  }: {
    instructions: string;
    observer?: AgentRunObserver;
  }) {
    const controller = new MaxStepAbortController({ maxSteps: 100 });

    const run = new AgentRun({
      agent: this,
      controller,
      observer,
      instructions,
    });

    observer?.onAgentRunStarted({ run });

    const textGenerator = this.textGenerator;
    const actionRegistry = this.actionRegistry;

    const messages: Array<OpenAIChatMessage> = [
      { role: "system", content: createSystemPrompt({ agent: this }) },
      { role: "user", content: `## TASK\n${instructions}` },
    ];

    const result = await run.executeStep(
      new DynamicCompositeStep({
        nextStepGenerator: {
          async generateNextStep({ completedSteps, run }) {
            const inputMessages = messages.slice(0);

            // TODO result formatting etc. (more complex prompt generator)
            for (const step of completedSteps) {
              const stepState = step.state;

              if (step.generatedText != null) {
                inputMessages.push({
                  role: "assistant",
                  content: step.generatedText,
                });
              }

              switch (stepState.type) {
                case "failed": {
                  inputMessages.push({
                    role: "system",
                    content: `ERROR:\n${stepState.summary}`,
                  });
                  break;
                }
                case "succeeded": {
                  if (stepState.output == null) {
                    break;
                  }

                  inputMessages.push({
                    role: "system",
                    content: JSON.stringify(stepState.output),
                  });
                  break;
                }
              }
            }

            run.observer?.onStepGenerationStarted({
              run,
              messages: inputMessages,
            });

            const generatedText = await textGenerator.generateText(
              { messages: inputMessages },
              undefined // TODO context = agent run
            );

            const actionParameters = actionRegistry.format.parse(generatedText);

            let step: Step;
            if (actionParameters.action == null) {
              step = new NoopStep({
                type: "thought",
                generatedText,
                summary: actionParameters._freeText,
              });
            } else {
              try {
                const action = actionRegistry.getAction(
                  actionParameters.action
                );

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
          },
        },
      })
    );

    observer?.onAgentRunFinished({ run, result });
  }
}

function createSystemPrompt({ agent }: { agent: Agent }) {
  return `## ROLE
${agent.role}

## CONSTRAINTS
${agent.constraints};

## AVAILABLE ACTIONS
${agent.actionRegistry.getAvailableActionInstructions()}`;
}
