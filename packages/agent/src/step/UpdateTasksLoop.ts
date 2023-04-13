import { AgentRun } from "../agent/AgentRun";
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

export class UpdateTasksLoop extends Step {
  tasks: Array<string>;

  private readonly generateExecutionStep: ({}: {
    task: string;
    run: AgentRun;
  }) => Step;

  private readonly updateTaskList: updateTaskList;

  constructor({
    type = "update-tasks",
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

  protected async _execute(): Promise<StepResult> {
    while (this.tasks.length > 0) {
      this.run.onLoopIterationStarted({ loop: this });

      const task = this.tasks.shift()!;

      const step = this.generateExecutionStep({
        task,
        run: this.run,
      });

      // TODO store the steps
      const result = await step.execute();

      if (result.type === "aborted" || result.type === "failed") {
        return result;
      }

      this.tasks = await this.updateTaskList({
        objective: this.run.objective,
        completedTask: task,
        completedTaskResult: result.summary,
        remainingTasks: this.tasks,
      });

      this.run.onLoopIterationFinished({ loop: this });
    }

    // TODO have a final result
    return { type: "succeeded", summary: "Completed all tasks." };
  }
}
