import * as $ from "@gptagent/agent";
import { Agent, runCLIAgent } from "@gptagent/agent";
import chalk from "chalk";
import dotenv from "dotenv";
import { prioritizeTasks } from "./prioritizeTasks";
import { addNewTasks } from "./addNewTasks";

dotenv.config();

const OBJECTIVE = "Solve world hunger.";

const textGenerator = new $.ai.openai.OpenAiChatTextGenerator({
  apiKey: process.env.OPENAI_API_KEY ?? "",
  model: "gpt-3.5-turbo",
});

function generateExecutionStep({
  objective,
  task,
  run,
}: {
  objective: string;
  task: string;
  run: $.agent.AgentRun;
}) {
  return new $.step.PromptStep({
    type: "execute-prompt",
    run,
    textGenerator,
    messages: [
      {
        role: "system",
        content: `You are an AI who performs one task based on the following objective: ${objective}.
Your task: ${task}
Response:`,
      },
    ],
    maxTokens: 2000,
    temperature: 0.7,
  });
}

export type updateTaskList = ({}: {
  objective: string;
  completedTask: string;
  completedTaskResult: string;
  remainingTasks: string[];
}) => PromiseLike<Array<string>>;

const generateAndPrioritizeTaskList: updateTaskList = async ({
  objective,
  completedTask,
  completedTaskResult,
  remainingTasks,
}: {
  objective: string;
  completedTask: string;
  completedTaskResult: string;
  remainingTasks: string[];
}): Promise<string[]> =>
  await prioritizeTasks({
    tasks: await addNewTasks({
      objective,
      completedTask,
      completedTaskResult,
      existingTasks: remainingTasks,
      textGenerator,
    }),
    objective,
    textGenerator,
  });

class UpdateTasksLoop extends $.step.Step {
  private readonly objective: string;
  private readonly generateExecutionStep: ({}: {
    objective: string;
    task: string;
    run: $.agent.AgentRun;
  }) => $.step.Step;
  private readonly updateTaskList: updateTaskList;

  private tasks: Array<string>;

  constructor({
    objective,
    initialTasks = ["Develop a task list."],
    generateExecutionStep,
    updateTaskList,
    run,
  }: {
    objective: string;
    initialTasks?: string[];
    generateExecutionStep: ({}: {
      objective: string;
      task: string;
      run: $.agent.AgentRun;
    }) => $.step.Step;
    updateTaskList: updateTaskList;
    run: $.agent.AgentRun;
  }) {
    super({ type: "planner", run });

    this.objective = objective;
    this.tasks = initialTasks;
    this.updateTaskList = updateTaskList;
    this.generateExecutionStep = generateExecutionStep;
  }

  protected async _execute(): Promise<$.step.StepResult> {
    while (this.tasks.length > 0) {
      // Print the task list
      console.log(chalk.green("*****TASK LIST*****"));
      console.log(
        `${this.tasks
          .map((task, index) => `${index + 1}: ${task}`)
          .join("\n")}\n`
      );

      // Step 1: Pull the first task
      const task = this.tasks.shift()!;
      console.log(chalk.green("*****NEXT TASK*****"));
      console.log(`${task}\n`);

      // Task execution:
      const step = this.generateExecutionStep({
        objective: this.objective,
        task,
        run: this.run,
      });

      const result = await step.execute();

      if (result.type === "aborted" || result.type === "failed") {
        return result;
      }

      const taskResult = result.summary;

      console.log(chalk.green("*****TASK RESULT*****"));
      console.log(taskResult);
      console.log();

      this.tasks = await this.updateTaskList({
        objective: this.objective,
        completedTask: task,
        completedTaskResult: taskResult,
        remainingTasks: this.tasks,
      });
    }

    return { type: "succeeded", summary: "Completed all tasks." };
  }
}

runCLIAgent({
  agent: new Agent({
    name: "Baby AGI",
    execute: async (run) =>
      new UpdateTasksLoop({
        objective: OBJECTIVE,
        generateExecutionStep,
        updateTaskList: generateAndPrioritizeTaskList,
        run,
      }),
  }),
});
