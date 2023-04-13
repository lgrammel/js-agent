import { ActionRegistry } from "../action/ActionRegistry";
import { AgentRun } from "../agent/AgentRun";
import { ChatTextGenerator } from "../component/text-generator/ChatTextGenerator";
import { Prompt } from "../prompt/Prompt";
import { ErrorStep } from "./ErrorStep";
import { NoopStep } from "./NoopStep";
import { Step } from "./Step";
import { StepResult } from "./StepResult";
import { StepFactory } from "./StepFactory";

export type DynamicCompositeStepContext = {
  actions: ActionRegistry;
  task: string;
  completedSteps: Array<Step>;
  generatedTextsByStepId: Map<string, string>;
};

export const createDynamicCompositeStep =
  ({
    type,
    actionRegistry,
    textGenerator,
    prompt,
  }: {
    type?: string;
    actionRegistry: ActionRegistry;
    textGenerator: ChatTextGenerator;
    prompt: Prompt<DynamicCompositeStepContext>;
  }): StepFactory =>
  async (run) =>
    new DynamicCompositeStep({
      type,
      run,
      actionRegistry,
      textGenerator,
      prompt,
    });

export class DynamicCompositeStep extends Step {
  protected readonly completedSteps: Array<Step> = [];
  private readonly generatedTextsByStepId = new Map<string, string>();

  readonly actionRegistry: ActionRegistry;
  readonly textGenerator: ChatTextGenerator;
  readonly prompt: Prompt<DynamicCompositeStepContext>;

  constructor({
    type = "composite.dynamic",
    run,
    actionRegistry,
    textGenerator,
    prompt,
  }: {
    type?: string;
    run: AgentRun;
    actionRegistry: ActionRegistry;
    textGenerator: ChatTextGenerator;
    prompt: Prompt<DynamicCompositeStepContext>;
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

  async _execute(): Promise<StepResult> {
    try {
      while (true) {
        if (this.run.isAborted()) {
          return { type: "aborted" };
        }

        const nextStep = await this.generateNextStep();

        const result = await nextStep.execute();

        if (result.type === "aborted") {
          return { type: "aborted" }; // don't store as completed step
        }

        this.completedSteps.push(nextStep);

        if (nextStep.isDoneStep()) {
          return result;
        }
      }
    } catch (error) {
      return {
        type: "failed",
        summary: `Failed to run step`, // TODO better summary
        error,
      };
    }
  }

  async generateNextStep(): Promise<Step> {
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
