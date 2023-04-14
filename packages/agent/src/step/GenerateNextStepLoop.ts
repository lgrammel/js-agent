import { ActionRegistry } from "../action/ActionRegistry";
import { AgentRun } from "../agent/AgentRun";
import { ChatTextGenerator } from "../component/text-generator/ChatTextGenerator";
import { Prompt } from "../prompt/Prompt";
import { ErrorStep } from "./ErrorStep";
import { NoopStep } from "./NoopStep";
import { Step } from "./Step";
import { StepResult } from "./StepResult";
import { StepFactory } from "./StepFactory";
import { Loop } from "./Loop";

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
    textGenerator,
    prompt,
  }: {
    type?: string;
    actionRegistry: ActionRegistry;
    textGenerator: ChatTextGenerator;
    prompt: Prompt<GenerateNextStepLoopContext>;
  }): StepFactory =>
  async (run) =>
    new GenerateNextStepLoop({
      type,
      run,
      actionRegistry,
      textGenerator,
      prompt,
    });

export class GenerateNextStepLoop extends Loop {
  private readonly generatedTextsByStepId = new Map<string, string>();

  readonly actionRegistry: ActionRegistry;
  readonly textGenerator: ChatTextGenerator;
  readonly prompt: Prompt<GenerateNextStepLoopContext>;

  constructor({
    type = "loop.generate-next-step",
    run,
    actionRegistry,
    textGenerator,
    prompt,
  }: {
    type?: string;
    run: AgentRun;
    actionRegistry: ActionRegistry;
    textGenerator: ChatTextGenerator;
    prompt: Prompt<GenerateNextStepLoopContext>;
  }) {
    super({ type, run });

    if (actionRegistry == null) {
      throw new Error("actionRegistry is required");
    }
    if (textGenerator == null) {
      throw new Error("textGenerator is required");
    }
    if (prompt == null) {
      throw new Error("prompt is required");
    }

    this.actionRegistry = actionRegistry;
    this.textGenerator = textGenerator;
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

    const generatedText = await this.textGenerator.generateText({ messages });

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
