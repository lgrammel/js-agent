import { ActionRegistry } from "../action/ActionRegistry";
import { AgentRun } from "../agent/AgentRun";
import { Prompt } from "../prompt/Prompt";
import { ErrorStep } from "./ErrorStep";
import { NoopStep } from "./NoopStep";
import { Step } from "./Step";
import { StepResult } from "./StepResult";
import { StepFactory } from "./StepFactory";
import { Loop } from "./Loop";
import { GenerateChatTextFunction } from "../component/generate-text";

export type GenerateNextStepLoopContext = {
  actions: ActionRegistry;
  task: string;
  completedSteps: Array<Step>;
  generatedTextsByStepId: Map<string, string>;
};

export const createGenerateNextStepLoop =
  ({
    type,
    actionRegistry,
    generateText,
    prompt,
  }: {
    type?: string;
    actionRegistry: ActionRegistry;
    generateText: GenerateChatTextFunction;
    prompt: Prompt<GenerateNextStepLoopContext>;
  }): StepFactory =>
  async (run) =>
    new GenerateNextStepLoop({
      type,
      run,
      actionRegistry,
      generateText,
      prompt,
    });

export class GenerateNextStepLoop extends Loop {
  private readonly generatedTextsByStepId = new Map<string, string>();

  readonly actionRegistry: ActionRegistry;
  readonly generateText: GenerateChatTextFunction;
  readonly prompt: Prompt<GenerateNextStepLoopContext>;

  constructor({
    type = "loop.generate-next-step",
    run,
    actionRegistry,
    generateText,
    prompt,
  }: {
    type?: string;
    run: AgentRun;
    actionRegistry: ActionRegistry;
    generateText: GenerateChatTextFunction;
    prompt: Prompt<GenerateNextStepLoopContext>;
  }) {
    super({ type, run });

    if (actionRegistry == null) {
      throw new Error("actionRegistry is required");
    }
    if (generateText == null) {
      throw new Error("generateText is required");
    }
    if (prompt == null) {
      throw new Error("prompt is required");
    }

    this.actionRegistry = actionRegistry;
    this.generateText = generateText;
    this.prompt = prompt;
  }

  protected hasMoreSteps(): boolean {
    const lastStep = this.completedSteps[this.completedSteps.length - 1];
    return !lastStep?.isDoneStep();
  }

  async getNextStep(): Promise<Step> {
    const messages = await this.prompt.generatePrompt({
      actions: this.actionRegistry,
      task: this.run.objective,
      completedSteps: this.completedSteps,
      generatedTextsByStepId: this.generatedTextsByStepId,
    });

    this.run.onStepGenerationStarted({ messages });

    const generatedText = await this.generateText({ messages });

    const actionParameters = this.actionRegistry.format.parse(generatedText);

    let step: Step;
    if (actionParameters.action == null) {
      step = new NoopStep({
        type: "thought",
        run: this.run,
        summary: actionParameters._freeText ?? "",
      });
    } else {
      try {
        const action = this.actionRegistry.getAction(actionParameters.action);

        step = await action.createStep({
          run: this.run,
          input: actionParameters,
        });
      } catch (error: any) {
        step = new ErrorStep({ run: this.run, error });
      }
    }

    this.generatedTextsByStepId.set(step.id, generatedText);

    this.run.onStepGenerationFinished({ generatedText, step });

    return step;
  }
}
