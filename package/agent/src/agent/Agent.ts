import { ActionRegistry } from "../action/ActionRegistry";
import { ToolAction } from "../action/tool/ToolAction";
import { RunCommandResultFormatter } from "../action/tool/run-command/RunCommandResultFormatter";
import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { ChatTextGenerator } from "../component/text-generator/ChatTextGenerator";
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
    observer?.onAgentRunStarted({ agent: this, instructions });

    const messages: Array<OpenAIChatMessage> = [
      { role: "system", content: createSystemPrompt({ agent: this }) },
      { role: "user", content: `## TASK\n${instructions}` },
    ];

    let stepCounter = 0;
    const maxSteps = 100;

    while (stepCounter < maxSteps) {
      observer?.onStepGenerationStarted({ agent: this, messages });

      const completion = await this.textGenerator.generateText(
        { messages },
        undefined // TODO context = agent run // TODO context = agent run
      );

      observer?.onStepGenerated({ agent: this, completion });

      messages.push({
        role: "assistant",
        content: completion,
      });

      if (completion.trim().endsWith("}")) {
        try {
          const firstOpeningBraceIndex = completion.indexOf("{");
          const jsonObject = JSON.parse(
            completion.slice(firstOpeningBraceIndex)
          );

          const actionType = jsonObject.action;
          const action = this.actionRegistry.getAction(actionType);

          observer?.onActionExecutionStarted({
            agent: this,
            actionType,
            action,
          });

          if (action === this.actionRegistry.doneAction) {
            observer?.onAgentRunFinished({
              agent: this,
              result: jsonObject,
            });
            return;
          }

          // TODO introduce tasks
          const toolAction = action as ToolAction<any, any>;

          const executionResult = await toolAction.executor.execute({
            input: jsonObject,
            action: toolAction,
            context: {
              workspacePath: process.cwd(), // TODO cleanup
            },
          });

          // TODO better formatter for output / result
          let formattedResult = JSON.stringify(executionResult);

          if (toolAction.type === "tool.run-command") {
            formattedResult = new RunCommandResultFormatter().formatResult({
              result: executionResult,
            });
          }

          observer?.onActionExecutionFinished({
            agent: this,
            actionType,
            action,
            result: executionResult,
          });

          messages.push({
            role: "system",
            content: formattedResult,
          });
        } catch (error: any) {
          observer?.onActionExecutionFailed({
            agent: this,
            actionType: "unknown",
            action: "unknown",
            error,
          });

          messages.push({
            role: "system",
            content: error?.message,
          });
        }
      }

      stepCounter++;
    }

    observer?.onAgentRunFinished({ agent: this, result: undefined });
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
