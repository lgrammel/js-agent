import chalk from "chalk";
import * as $ from "js-agent";

const log = console.log;

export async function runBabyAGI({
  openAiApiKey,
  objective,
}: {
  openAiApiKey: string;
  objective: string;
}) {
  const generateNewTasks = $.text.generate({
    id: "generate-new-tasks",
    async prompt({
      objective,
      completedTask,
      completedTaskResult,
      existingTasks,
    }: {
      objective: string;
      completedTask: string;
      completedTaskResult: string;
      existingTasks: string[];
    }) {
      return `You are an task creation AI that uses the result of an execution agent to create new tasks with the following objective: ${objective}.
The last completed task has the result: ${completedTaskResult}.
This result was based on this task description: ${completedTask}.
These are the incomplete tasks: ${existingTasks.join(", ")}. 
Based on the result, create new tasks to be completed by the AI system that do not overlap with incomplete tasks.
Return the tasks as an array.`;
    },
    model: $.provider.openai.completionModel({
      apiKey: openAiApiKey,
      model: "text-davinci-003",
      maxTokens: 100,
      temperature: 0.5,
    }),
    processOutput: async (output) => output.trim().split("\n"),
  });

  const prioritizeTasks = $.text.generate({
    id: "prioritize-tasks",
    async prompt({ tasks, objective }: { tasks: string[]; objective: string }) {
      return `You are an task prioritization AI tasked with cleaning the formatting of and reprioritizing the following tasks:
${tasks.join(", ")}.
Consider the ultimate objective of your team:${objective}.
Do not remove any tasks. 
Return the result as a numbered list, like:
#. First task
#. Second task
Start the task list with number 1.`;
    },
    model: $.provider.openai.completionModel({
      apiKey: openAiApiKey,
      model: "text-davinci-003",
      maxTokens: 1000,
      temperature: 0.5,
    }),
    processOutput: async (output) =>
      output
        .trim()
        .split("\n")
        .map((task) => {
          const [idPart, ...rest] = task.trim().split(".");
          return rest.join(".").trim();
        }),
  });

  return $.runAgent({
    objective,
    agent: $.step.createUpdateTasksLoop({
      type: "main",
      generateExecutionStep({ task, run }) {
        return new $.step.PromptStep({
          type: "execute-prompt",
          run,
          async prompt({ task }: { task: string }) {
            return `You are an AI who performs one task based on the following objective: ${run.objective}.
Your task: ${task}
Response:`;
          },
          input: { task },
          model: $.provider.openai.completionModel({
            apiKey: openAiApiKey,
            model: "text-davinci-003",
            maxTokens: 2000,
            temperature: 0.7,
          }),
        });
      },
      async updateTaskList(
        { objective, completedTask, completedTaskResult, remainingTasks },
        context
      ) {
        const newTasks = await generateNewTasks(
          {
            objective,
            completedTask,
            completedTaskResult,
            existingTasks: remainingTasks,
          },
          context
        );

        return prioritizeTasks(
          {
            tasks: remainingTasks.concat(newTasks),
            objective,
          },
          context
        );
      },
    }),
    observer: {
      onRunStarted({ run }) {
        log(chalk.green("*****BABY AGI *****"));
        log();
        log(chalk.green("*****OBJECTIVE*****"));
        log(run.objective);
        log();
      },
      onLoopIterationStarted({ loop }) {
        if (loop.type === "main" && loop instanceof $.step.UpdateTasksLoop) {
          log(chalk.green("*****TASK LIST*****"));
          log(
            `${loop.tasks
              .map((task, index) => `${index + 1}: ${task}`)
              .join("\n")}\n`
          );

          log(chalk.green("*****NEXT TASK*****"));
          log(`${loop.tasks[0]}\n`);
        }
      },
      onStepExecutionFinished({ step }) {
        if (step.state.type === "succeeded" || step.state.type === "failed") {
          log(chalk.green("*****TASK RESULT*****"));
          log(step.state.summary);
          log();
        }
      },
    },
  });
}
