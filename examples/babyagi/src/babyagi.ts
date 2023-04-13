import * as $ from "@gptagent/agent";
import { Agent, runCLIAgent } from "@gptagent/agent";
import chalk from "chalk";
import dotenv from "dotenv";
import { prioritizeTasks } from "./prioritizeTasks";
import { addNewTasks } from "./addNewTasks";

dotenv.config();

// TODO should come from instructions
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

runCLIAgent({
  agent: new Agent({
    name: "Baby AGI",
    execute: async (run) =>
      new $.step.UpdateTasksLoop({
        type: "main",
        objective: OBJECTIVE,
        generateExecutionStep,
        updateTaskList: async ({
          objective,
          completedTask,
          completedTaskResult,
          remainingTasks,
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
          }),
        run,
      }),
  }),
  observer: {
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
});
