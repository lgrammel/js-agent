import chalk from "chalk";
import * as $ from "js-agent";

export async function runBabyAGI({
  openAiApiKey,
  objective,
}: {
  openAiApiKey: string;
  objective: string;
}) {
  const generateNewTasks = $.text.generate({
    prompt: async ({
      objective,
      completedTask,
      completedTaskResult,
      existingTasks,
    }: {
      objective: string;
      completedTask: string;
      completedTaskResult: string;
      existingTasks: string[];
    }) => [
      {
        role: "system" as const,
        content: `You are an task creation AI that uses the result of an execution agent to create new tasks with the following objective: ${objective}.
The last completed task has the result: ${completedTaskResult}.
This result was based on this task description: ${completedTask}.
These are the incomplete tasks: ${existingTasks.join(", ")}. 
Based on the result, create new tasks to be completed by the AI system that do not overlap with incomplete tasks.
Return the tasks as an array.`,
      },
    ],
    generate: $.ai.openai.generateChatText({
      apiKey: openAiApiKey,
      model: "gpt-3.5-turbo",
      maxTokens: 100,
      temperature: 0.5,
    }),
    processOutput: async (output) => output.trim().split("\n"),
  });

  const prioritizeTasks = $.text.generate({
    prompt: async ({
      tasks,
      objective,
    }: {
      tasks: string[];
      objective: string;
    }) => [
      {
        role: "system" as const,
        content: `You are an task prioritization AI tasked with cleaning the formatting of and reprioritizing the following tasks:
${tasks.join(", ")}.
Consider the ultimate objective of your team:${objective}.
Do not remove any tasks. 
Return the result as a numbered list, like:
#. First task
#. Second task
Start the task list with number 1.`,
      },
    ],
    generate: $.ai.openai.generateChatText({
      apiKey: openAiApiKey,
      model: "gpt-3.5-turbo",
      maxTokens: 1000,
      temperature: 0.5,
    }),
    processOutput: async (output) => {
      return output
        .trim()
        .split("\n")
        .map((task) => {
          const [idPart, ...rest] = task.trim().split(".");
          return rest.join(".").trim();
        });
    },
  });

  return $.runAgent({
    agent: $.step.createUpdateTasksLoop({
      type: "main",
      generateExecutionStep({ task, run }) {
        return new $.step.PromptStep({
          type: "execute-prompt",
          run,
          async prompt({ task }: { task: string }) {
            return [
              {
                role: "system" as const,
                content: `You are an AI who performs one task based on the following objective: ${run.objective}.
Your task: ${task}
Response:`,
              },
            ];
          },
          input: { task },
          generate: $.ai.openai.generateChatText({
            apiKey: openAiApiKey,
            model: "gpt-3.5-turbo",
            maxTokens: 2000,
            temperature: 0.7,
          }),
        });
      },
      async updateTaskList({
        objective,
        completedTask,
        completedTaskResult,
        remainingTasks,
      }) {
        return prioritizeTasks({
          tasks: remainingTasks.concat(
            await generateNewTasks({
              objective,
              completedTask,
              completedTaskResult,
              existingTasks: remainingTasks,
            })
          ),
          objective,
        });
      },
    }),
    observer: {
      onAgentRunStarted({ run }) {
        console.log(chalk.green("*****BABY AGI *****"));
        console.log();
        console.log(chalk.green("*****OBJECTIVE*****"));
        console.log(run.objective);
        console.log();
      },
      onLoopIterationStarted({ loop }) {
        if (loop.type === "main" && loop instanceof $.step.UpdateTasksLoop) {
          console.log(chalk.green("*****TASK LIST*****"));
          console.log(
            `${loop.tasks
              .map((task, index) => `${index + 1}: ${task}`)
              .join("\n")}\n`
          );

          const nextTask = loop.tasks[0];
          console.log(chalk.green("*****NEXT TASK*****"));
          console.log(`${nextTask}\n`);
        }
      },
      onStepExecutionFinished({ step }) {
        if (step.state.type === "succeeded" || step.state.type === "failed") {
          console.log(chalk.green("*****TASK RESULT*****"));
          console.log(step.state.summary);
          console.log();
        }
      },
    },
    objective,
  });
}
