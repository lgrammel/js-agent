import { Run } from "../agent/Run";
import { RunContext } from "../agent/RunContext";
import { Loop } from "./Loop";
import { Step } from "./Step";
import { StepFactory } from "./StepFactory";
import { StepResult } from "./StepResult";

export const createUpdateTasksLoop =
  <RUN_PROPERTIES>({
    type,
    initialTasks,
    generateExecutionStep,
    updateTaskList,
  }: {
    type?: string;
    initialTasks?: string[];
    generateExecutionStep: ({}: {
      task: string;
      run: Run<RUN_PROPERTIES>;
    }) => Step<RUN_PROPERTIES>;
    updateTaskList: updateTaskList<RUN_PROPERTIES>;
  }): StepFactory<RUN_PROPERTIES> =>
  async (run) =>
    new UpdateTasksLoop({
      type,
      initialTasks,
      generateExecutionStep,
      updateTaskList,
      run,
    });

export type updateTaskList<RUN_PROPERTIES> = (
  _: {
    runProperties: RUN_PROPERTIES;
    completedTask: string;
    completedTaskResult: string;
    remainingTasks: string[];
  },
  context: RunContext
) => PromiseLike<Array<string>>;

export class UpdateTasksLoop<RUN_PROPERTIES> extends Loop<RUN_PROPERTIES> {
  tasks: Array<string>;
  currentTask: string | undefined;

  private readonly generateExecutionStep: ({}: {
    task: string;
    run: Run<RUN_PROPERTIES>;
  }) => Step<RUN_PROPERTIES>;

  private readonly updateTaskList: updateTaskList<RUN_PROPERTIES>;

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
      run: Run<RUN_PROPERTIES>;
    }) => Step<RUN_PROPERTIES>;
    updateTaskList: updateTaskList<RUN_PROPERTIES>;
    run: Run<RUN_PROPERTIES>;
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
    step: Step<RUN_PROPERTIES>;
    result: StepResult & {
      type: "succeeded" | "failed";
    };
  }) {
    this.tasks = await this.updateTaskList(
      {
        runProperties: this.run.properties,
        completedTask: this.currentTask!,
        completedTaskResult: result.summary,
        remainingTasks: this.tasks,
      },
      this.run
    );
    this.currentTask = undefined;
  }
}
