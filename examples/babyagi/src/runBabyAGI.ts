import chalk from "chalk";
import * as $ from "js-agent";
import { addNewTasks } from "./addNewTasks";
import { prioritizeTasks } from "./prioritizeTasks";

export async function runBabyAGI({
  openAiApiKey,
  objective,
}: {
  openAiApiKey: string;
  objective: string;
}) {
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
          tasks: await addNewTasks({
            objective,
            completedTask,
            completedTaskResult,
            existingTasks: remainingTasks,
            generateText: $.ai.openai.generateChatText({
              apiKey: openAiApiKey,
              model: "gpt-3.5-turbo",
              maxTokens: 100,
              temperature: 0.5,
            }),
          }),
          objective,
          generateText: $.ai.openai.generateChatText({
            apiKey: openAiApiKey,
            model: "gpt-3.5-turbo",
            maxTokens: 1000,
            temperature: 0.5,
          }),
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
