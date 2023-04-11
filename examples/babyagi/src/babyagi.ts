import * as $ from "@gptagent/agent";
import { Agent, runCLIAgent } from "@gptagent/agent";
import { AgentRun } from "@gptagent/agent/.build/js/agent";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

const OBJECTIVE = "Solve world hunger.";
const YOUR_FIRST_TASK = "Develop a task list.";

const textGenerator = new $.ai.openai.OpenAiChatTextGenerator({
  apiKey: process.env.OPENAI_API_KEY ?? "",
  model: "gpt-3.5-turbo",
});

type Task = {
  id: number;
  description: string;
};

function generateExecutionStep({
  objective,
  task,
}: {
  objective: string;
  task: string;
}) {
  return new $.step.PromptStep({
    type: "execute-prompt",
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

class DynamicTaskListStep extends $.step.Step {
  private readonly objective: string;
  private readonly generateExecutionStep: ({}: {
    objective: string;
    task: string;
  }) => $.step.Step;

  private tasks: Array<Task>;
  private taskIdCounter = 1;

  constructor({
    objective,
    tasks,
    generateExecutionStep,
  }: {
    objective: string;
    tasks: string[];
    generateExecutionStep: ({}: {
      objective: string;
      task: string;
    }) => $.step.Step;
  }) {
    super({ type: "planner" });

    this.objective = objective;
    this.tasks = tasks.map((task) => ({
      id: this.taskIdCounter++,
      description: task,
    }));
    this.generateExecutionStep = generateExecutionStep;
  }

  private async createTasks({
    taskResult,
    task,
  }: {
    taskResult: string;
    task: Task;
  }) {
    return (
      await textGenerator.generateText({
        messages: [
          {
            role: "system",
            content: `You are an task creation AI that uses the result of an execution agent to create new tasks with the following objective: ${
              this.objective
            }.
The last completed task has the result: ${taskResult}.
This result was based on this task description: ${task.description}.
These are incomplete tasks: ${this.tasks
              .map((task) => task.description)
              .join(", ")}. 
Based on the result, create new tasks to be completed by the AI system that do not overlap with incomplete tasks.
Return the tasks as an array.`,
          },
        ],
        maxTokens: 100,
        temperature: 0.5,
      })
    )
      .trim()
      .split("\n");
  }

  private async prioritizeTasks({ currentTaskId }: { currentTaskId: number }) {
    const newTasks = (
      await textGenerator.generateText({
        messages: [
          {
            role: "system",
            content: `You are an task prioritization AI tasked with cleaning the formatting of and reprioritizing the following tasks:
${this.tasks.join(", ")}.
Consider the ultimate objective of your team:${this.objective}.
Do not remove any tasks. 
Return the result as a numbered list, like:
#. First task
#. Second task
Start the task list with number ${currentTaskId}.`,
          },
        ],
        maxTokens: 1000,
        temperature: 0.5,
      })
    )
      .trim()
      .split("\n");

    this.tasks = [];
    for (const taskText of newTasks) {
      const [idPart, ...rest] = taskText.trim().split(".");
      const descriptionPart = rest.join(".").trim();

      this.tasks.push({
        id: parseInt(idPart),
        description: descriptionPart,
      });
    }
  }

  private async updateTaskList({
    task,
    taskResult,
  }: {
    task: Task;
    taskResult: string;
  }) {
    const newTasks = await this.createTasks({ task, taskResult });

    this.tasks.push(
      ...newTasks.map((task) => ({
        id: this.taskIdCounter++,
        description: task,
      }))
    );

    await this.prioritizeTasks({ currentTaskId: task.id });
  }

  protected async _run(run: AgentRun): Promise<$.step.StepResult> {
    while (this.tasks.length > 0) {
      // Print the task list
      console.log(chalk.green("*****TASK LIST*****"));
      console.log(
        `${this.tasks
          .map((task) => `${task.id}: ${task.description}`)
          .join("\n")}\n`
      );

      // Step 1: Pull the first task
      const task = this.tasks.shift()!;
      console.log(chalk.green("*****NEXT TASK*****"));
      console.log(`${task.description}\n`);

      // Task execution:
      const step = this.generateExecutionStep({
        objective: this.objective,
        task: task.description,
      });
      const result = await run.executeStep(step);
      if (result.type === "aborted" || result.type === "failed") {
        return result;
      }
      const taskResult = result.summary;

      console.log(chalk.green("*****TASK RESULT*****"));
      console.log(taskResult);
      console.log();

      await this.updateTaskList({ task, taskResult });
    }

    return { type: "succeeded", summary: "Completed all tasks." };
  }
}

runCLIAgent({
  agent: new Agent({
    name: "Baby AGI",
    rootStep: new DynamicTaskListStep({
      objective: OBJECTIVE,
      tasks: [YOUR_FIRST_TASK],
      generateExecutionStep,
    }),
  }),
});
