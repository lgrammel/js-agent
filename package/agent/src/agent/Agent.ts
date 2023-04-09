import { ActionRegistry } from "../action/ActionRegistry";
import { ChatTextGenerator } from "../component/text-generator/ChatTextGenerator";
import { DynamicCompositeStep } from "../step/DynamicCompositeStep";
import { MaxStepAbortController } from "../step/MaxStepAbortController";
import { AgentRun } from "./AgentRun";
import { AgentRunObserver } from "./AgentRunObserver";
import { BasicNextStepGenerator } from "./BasicNextStepGenerator";

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

    const result = await run.executeStep(
      new DynamicCompositeStep({
        nextStepGenerator: new BasicNextStepGenerator({
          actionRegistry,
          textGenerator,
        }),
      })
    );

    observer?.onAgentRunFinished({ run, result });
  }
}
