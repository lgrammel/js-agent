import { AnyAction } from "../action/Action";
import { ActionRegistry } from "../action/ActionRegistry";
import { ActionFormat } from "../action/format/ActionFormat";
import { Run } from "../agent/Run";
import { RunContext } from "../agent/RunContext";
import { Prompt } from "../prompt/Prompt";
import { GeneratorModel, generate as generateFunction } from "../text/generate";
import { ErrorStep } from "./ErrorStep";
import { Loop } from "./Loop";
import { NoopStep } from "./NoopStep";
import { Step } from "./Step";
import { StepFactory } from "./StepFactory";

export type GenerateNextStepLoopContext<RUN_STATE> = {
  runState: RUN_STATE;
  actions: ActionRegistry;
  completedSteps: Array<Step<RUN_STATE>>;
  generatedTextsByStepId: Map<string, string>;
};

export const generateNextStepLoop =
  <PROMPT_TYPE, RUN_STATE>({
    type,
    actions,
    actionFormat,
    doneAction,
    prompt,
    model,
  }: {
    type?: string;
    doneAction?: AnyAction;
    actions: AnyAction[];
    actionFormat: ActionFormat;
    prompt: Prompt<GenerateNextStepLoopContext<RUN_STATE>, PROMPT_TYPE>;
    model: GeneratorModel<PROMPT_TYPE, any, string>;
  }): StepFactory<RUN_STATE> =>
  async (run) =>
    new GenerateNextStepLoop({
      type,
      run,
      actions,
      actionFormat,
      prompt,
      model,
    });

type NextStepLoopGenerateTextFunction<RUN_STATE> = (
  _0: GenerateNextStepLoopContext<RUN_STATE>,
  _1: RunContext
) => PromiseLike<string>;

export class GenerateNextStepLoop<
  PROMPT_TYPE,
  RUN_STATE
> extends Loop<RUN_STATE> {
  private readonly generatedTextsByStepId = new Map<string, string>();

  readonly actionRegistry: ActionRegistry;
  readonly generateText: NextStepLoopGenerateTextFunction<RUN_STATE>;

  constructor({
    type = "loop.generate-next-step",
    run,
    doneAction,
    actions,
    actionFormat,
    prompt,
    model,
  }: {
    type?: string;
    run: Run<RUN_STATE>;
    doneAction?: AnyAction;
    actions: AnyAction[];
    actionFormat: ActionFormat;
    prompt: Prompt<GenerateNextStepLoopContext<RUN_STATE>, PROMPT_TYPE>;
    model: GeneratorModel<PROMPT_TYPE, any, string>;
  }) {
    super({ type, run });

    if (prompt == null) {
      throw new Error("prompt is required");
    }
    if (model == null) {
      throw new Error("model is required");
    }

    this.actionRegistry = new ActionRegistry({
      doneAction,
      actions,
      format: actionFormat,
    });
    this.generateText = generateFunction({
      id: `step/${this.id}/generate-text`,
      prompt,
      model,
      processOutput: async (output) => output,
    });
  }

  protected hasMoreSteps(): boolean {
    const lastStep = this.completedSteps[this.completedSteps.length - 1];
    return !lastStep?.isDoneStep();
  }

  async getNextStep(): Promise<Step<RUN_STATE>> {
    this.run.onStepGenerationStarted();

    const generatedText = await this.generateText(
      {
        runState: this.run.state,
        actions: this.actionRegistry,
        completedSteps: this.completedSteps,
        generatedTextsByStepId: this.generatedTextsByStepId,
      },
      this.run
    );

    const actionParameters = this.actionRegistry.format.parse(generatedText);

    let step: Step<RUN_STATE>;
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
