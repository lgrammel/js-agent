import { AgentRun } from "../agent/AgentRun";
import { Loop } from "./Loop";
import { Step } from "./Step";
import { StepFactory } from "./StepFactory";
import { StepResult } from "./StepResult";

export const createUpdateTasksLoop =
  ({
    type,
    initialTasks,
    generateExecutionStep,
    updateTaskList,
  }: {
    type?: string;
    initialTasks?: string[];
    generateExecutionStep: ({}: { task: string; run: AgentRun }) => Step;
    updateTaskList: updateTaskList;
  }): StepFactory =>
  async (run) =>
    new UpdateTasksLoop({
      type,
      initialTasks,
      generateExecutionStep,
      updateTaskList,
      run,
    });

export type updateTaskList = ({}: {
  objective: string;
  completedTask: string;
  completedTaskResult: string;
  remainingTasks: string[];
}) => PromiseLike<Array<string>>;

export class UpdateTasksLoop extends Loop {
  tasks: Array<string>;
  currentTask: string | undefined;

  private readonly generateExecutionStep: ({}: {
    task: string;
    run: AgentRun;
  }) => Step;

  private readonly updateTaskList: updateTaskList;

  constructor({
    type = "loop.update-tasks",
    initialTasks = ["Develop a task list."],
    generateExecutionStep,
    updateTaskList,
    run,
  }: {
    type?: string;
    initialTasks?: string[];
    generateExecutionStep: ({}: { task: string; run: AgentRun }) => Step;
    updateTaskList: updateTaskList;
    run: AgentRun;
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
    step: Step;
    result: StepResult & {
      type: "succeeded" | "failed";
    };
  }) {
    this.tasks = await this.updateTaskList({
      objective: this.run.objective,
      completedTask: this.currentTask!,
      completedTaskResult: result.summary,
      remainingTasks: this.tasks,
    });
    this.currentTask = undefined;
  }
}
