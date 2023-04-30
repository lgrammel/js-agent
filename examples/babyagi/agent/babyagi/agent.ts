import * as $ from "js-agent";
import zod from "zod";

const openai = $.provider.openai;

export default {
  environment: {
    openAiApiKey: $.agent.env.property("OPENAI_API_KEY"),
  },
  inputSchema: zod.object({
    objective: zod.string(),
  }),
  init: async ({ input }) => input,
  execute: async ({ environment: { openAiApiKey } }) => {
    const generateNewTasks = $.text.generate.asFunction({
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
      model: openai.textModel({
        apiKey: openAiApiKey,
        model: "text-davinci-003",
        maxTokens: 100,
        temperature: 0.5,
      }),
      processOutput: async (output) => output.trim().split("\n"),
    });

    const prioritizeTasks = $.text.generate.asFunction({
      id: "prioritize-tasks",
      async prompt({
        tasks,
        objective,
      }: {
        tasks: string[];
        objective: string;
      }) {
        return `You are an task prioritization AI tasked with cleaning the formatting of and reprioritizing the following tasks:
${tasks.join(", ")}.
Consider the ultimate objective of your team: ${objective}.
Do not remove any tasks. 
Return the result as a numbered list, like:
#. First task
#. Second task
Start the task list with number 1.`;
      },
      model: openai.textModel({
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

    return $.step.updateTasksLoop({
      type: "main",
      generateExecutionStep({ task, run }) {
        return new $.step.PromptStep({
          type: "execute-prompt",
          run,
          input: { task },
          async prompt({ task }) {
            return `You are an AI who performs one task based on the following objective: ${run.state.objective}.
Your task: ${task}
Response:`;
          },
          model: openai.textModel({
            apiKey: openAiApiKey,
            model: "text-davinci-003",
            maxTokens: 2000,
            temperature: 0.7,
          }),
        });
      },
      async updateTaskList(
        {
          runState: { objective },
          completedTask,
          completedTaskResult,
          remainingTasks,
        },
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
            objective,
            tasks: remainingTasks.concat(newTasks),
          },
          context
        );
      },
    });
  },
  createDataProvider: () => {
    let log: string[] = [];

    return {
      onAgentRunStarted({ run }: { run: $.agent.Run<{ objective: string }> }) {
        log.push("*****BABY AGI *****\n\n");
        log.push("*****OBJECTIVE*****\n");
        log.push(run.state.objective);
        log.push("\n\n");
      },

      onLoopIterationStarted({ loop }) {
        if (loop.type === "main" && loop instanceof $.step.UpdateTasksLoop) {
          log.push("*****TASK LIST*****\n");
          log.push(
            `${loop.tasks
              .map((task, index) => `${index + 1}: ${task}`)
              .join("\n")}\n`
          );

          const nextTask = loop.tasks[0];
          log.push("*****NEXT TASK*****\n");
          log.push(`${nextTask}\n`);
        }
      },

      onStepExecutionFinished({ step }) {
        if (step.state.type === "succeeded" || step.state.type === "failed") {
          log.push("*****TASK RESULT*****\n");
          log.push(step.state.summary);
          log.push("\n\n");
        }
      },

      async getData({ run }) {
        const runCostInMillicent = await $.agent.calculateRunCostInMillicent({
          run,
        });

        return {
          log,
          cost: `$${(runCostInMillicent / 1000 / 100).toFixed(2)}`,
        };
      },
    } as $.agent.DataProvider<
      { objective: string },
      { log: string[]; cost: string }
    >;
  },
} satisfies $.server.ServerAgentSpecification<
  { openAiApiKey: string },
  { objective: string },
  { objective: string },
  { log: string[]; cost: string }
>;
