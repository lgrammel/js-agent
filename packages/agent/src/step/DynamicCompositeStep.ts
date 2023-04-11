import { ActionRegistry } from "../action/ActionRegistry";
import { AgentRun } from "../agent/AgentRun";
import { ChatTextGenerator } from "../component/text-generator/ChatTextGenerator";
import { Prompt } from "../prompt/Prompt";
import { ErrorStep } from "./ErrorStep";
import { NoopStep } from "./NoopStep";
import { Step } from "./Step";
import { StepResult } from "./StepResult";

export type DynamicCompositeStepContext = {
  actions: ActionRegistry;
  task: string;
  completedSteps: Array<Step>;
};

export class DynamicCompositeStep extends Step {
  protected readonly completedSteps: Array<Step> = [];

  readonly actionRegistry: ActionRegistry;
  readonly textGenerator: ChatTextGenerator;
  readonly prompt: Prompt<{
    actions: ActionRegistry;
    task: string;
    completedSteps: Array<Step>;
  }>;

  constructor({
    actionRegistry,
    textGenerator,
    prompt,
  }: {
    actionRegistry: ActionRegistry;
    textGenerator: ChatTextGenerator;
    prompt: Prompt<DynamicCompositeStepContext>;
  }) {
    super({ type: "composite.dynamic" });

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

  async _run(run: AgentRun): Promise<StepResult> {
    try {
      while (true) {
        if (run.isAborted()) {
          return { type: "aborted" };
        }

        const nextStep = await this.generateNextStep({ run });

        const result = await run.executeStep(nextStep);

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

  async generateNextStep({ run }: { run: AgentRun }): Promise<Step> {
    const messages = await this.prompt.generatePrompt({
      actions: this.actionRegistry,
      task: run.task,
      completedSteps: this.completedSteps,
    });

    run.onStepGenerationStarted({ messages });

    const generatedText = await this.textGenerator.generateText({ messages });

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

    run.onStepGenerationFinished({ generatedText, step });

    return step;
  }
}
