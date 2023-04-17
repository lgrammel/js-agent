import { ActionRegistry } from "../action/ActionRegistry";
import { AgentRun } from "../agent/AgentRun";
import { Prompt } from "../prompt/Prompt";
import { generate as generateFunction } from "../text/generate/generate";
import { ErrorStep } from "./ErrorStep";
import { Loop } from "./Loop";
import { NoopStep } from "./NoopStep";
import { Step } from "./Step";
import { StepFactory } from "./StepFactory";

export type GenerateNextStepLoopContext = {
  actions: ActionRegistry;
  task: string;
  completedSteps: Array<Step>;
  generatedTextsByStepId: Map<string, string>;
};

export const createGenerateNextStepLoop =
  <PROMPT_TYPE>({
    type,
    actionRegistry,
    prompt,
    generate,
  }: {
    type?: string;
    actionRegistry: ActionRegistry;
    prompt: Prompt<GenerateNextStepLoopContext, PROMPT_TYPE>;
    generate: (value: PROMPT_TYPE) => PromiseLike<string>;
  }): StepFactory =>
  async (run) =>
    new GenerateNextStepLoop({
      type,
      run,
      actionRegistry,
      prompt,
      generate,
    });

type NextStepLoopGenerateTextFunction =
  ({}: GenerateNextStepLoopContext) => PromiseLike<string>;

export class GenerateNextStepLoop<PROMPT_TYPE> extends Loop {
  private readonly generatedTextsByStepId = new Map<string, string>();

  readonly actionRegistry: ActionRegistry;
  readonly generateText: NextStepLoopGenerateTextFunction;

  constructor({
    type = "loop.generate-next-step",
    run,
    actionRegistry,
    prompt,
    generate,
  }: {
    type?: string;
    run: AgentRun;
    actionRegistry: ActionRegistry;
    prompt: Prompt<GenerateNextStepLoopContext, PROMPT_TYPE>;
    generate: (value: PROMPT_TYPE) => PromiseLike<string>;
  }) {
    super({ type, run });

    if (actionRegistry == null) {
      throw new Error("actionRegistry is required");
    }
    if (prompt == null) {
      throw new Error("prompt is required");
    }
    if (generate == null) {
      throw new Error("generate is required");
    }

    this.actionRegistry = actionRegistry;
    this.generateText = generateFunction({
      prompt,
      generate,
    });
  }

  protected hasMoreSteps(): boolean {
    const lastStep = this.completedSteps[this.completedSteps.length - 1];
    return !lastStep?.isDoneStep();
  }

  async getNextStep(): Promise<Step> {
    this.run.onStepGenerationStarted();

    const generatedText = await this.generateText({
      actions: this.actionRegistry,
      task: this.run.objective,
      completedSteps: this.completedSteps,
      generatedTextsByStepId: this.generatedTextsByStepId,
    });

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
