import { Run } from "../agent/Run";
import { RunContext } from "../agent/RunContext";
import { Loop } from "./Loop";
import { Step } from "./Step";
import { StepFactory } from "./StepFactory";
import { StepResult } from "./StepResult";

export const updateTasksLoop =
  <RUN_STATE>({
    type,
    initialTasks,
    generateExecutionStep,
    updateTaskList,
  }: {
    type?: string;
    initialTasks?: string[];
    generateExecutionStep: ({}: {
      task: string;
      run: Run<RUN_STATE>;
    }) => Step<RUN_STATE>;
    updateTaskList: updateTaskList<RUN_STATE>;
  }): StepFactory<RUN_STATE> =>
  async (run) =>
    new UpdateTasksLoop({
      type,
      initialTasks,
      generateExecutionStep,
      updateTaskList,
      run,
    });

export type updateTaskList<RUN_STATE> = (
  _: {
    runProperties: RUN_STATE;
    completedTask: string;
    completedTaskResult: string;
    remainingTasks: string[];
  },
  context: RunContext
) => PromiseLike<Array<string>>;

export class UpdateTasksLoop<RUN_STATE> extends Loop<RUN_STATE> {
  tasks: Array<string>;
  currentTask: string | undefined;

  private readonly generateExecutionStep: ({}: {
    task: string;
    run: Run<RUN_STATE>;
  }) => Step<RUN_STATE>;

  private readonly updateTaskList: updateTaskList<RUN_STATE>;

  constructor({
    type = "loop.update-tasks",
    initialTasks = ["Develop a task list."],
    generateExecutionStep,
    updateTaskList,
    run,
  }: {
    type?: string;
    initialTasks?: string[];
    generateExecutionStep: ({}: {
      task: string;
      run: Run<RUN_STATE>;
    }) => Step<RUN_STATE>;
    updateTaskList: updateTaskList<RUN_STATE>;
    run: Run<RUN_STATE>;
  }) {
    super({ type, run });

    this.tasks = initialTasks;

    this.updateTaskList = updateTaskList;
    this.generateExecutionStep = generateExecutionStep;
  }

  protected async getNextStep() {
    this.currentTask = this.tasks.shift()!;
    return this.generateExecutionStep({
      task: this.currentTask,
      run: this.run,
    });
  }

  protected hasMoreSteps(): boolean {
    return this.tasks.length > 0;
  }

  protected async update({
    step,
    result,
  }: {
    step: Step<RUN_STATE>;
    result: StepResult & {
      type: "succeeded" | "failed";
    };
  }) {
    this.tasks = await this.updateTaskList(
      {
        runProperties: this.run.state,
        completedTask: this.currentTask!,
        completedTaskResult: result.summary,
        remainingTasks: this.tasks,
      },
      this.run
    );
    this.currentTask = undefined;
  }
}
