import * as $ from "js-agent";

export async function runDeveloperAgent({
  openAiApiKey,
  task,
  projectInstructions,
  setupCommands,
}: {
  openAiApiKey: string;
  task: string;
  projectInstructions: string;
  setupCommands: string[];
}) {
  const model = $.provider.openai.chatModel({
    apiKey: openAiApiKey,
    model: "gpt-4",
  });

  const executeRemote = $.tool.executeRemoteTool({
    baseUrl: "http://localhost:3001",
  }) as any;

  return $.runAgent({
    properties: { task, projectInstructions },
    agent: $.step.createFixedStepsLoop({
      steps: [
        $.step.createFixedStepsLoop({
          type: "setup",
          steps: setupCommands.map(
            (command) => async (run) =>
              $.step.createActionStep({
                action: $.tool.runCommand({ execute: executeRemote }),
                input: { command },
                run,
              })
          ),
        }),
        $.step.generateNextStepLoop({
          actions: [
            $.tool.readFile({ execute: executeRemote }),
            $.tool.writeFile({ execute: executeRemote }),
            $.tool.runCommand({ execute: executeRemote }),
            $.tool.askUser({
              execute: $.tool.executeAskUser(),
            }),
          ],
          actionFormat: $.action.format.json(),
          prompt: $.prompt.concatChatPrompts(
            $.prompt.sectionsChatPrompt({
              role: "system",
              getSections: async ({ runState: { projectInstructions } }) => [
                {
                  title: "role",
                  content: `You are a software developer that creates and modifies JavaScript programs.
You are working in a Linux environment.`,
                },
                { title: "project", content: projectInstructions },
                {
                  title: "constraints",
                  content: `You must verify that the changes that you make are working.`,
                },
              ],
            }),
            $.prompt.availableActionsChatPrompt(),
            $.prompt.sectionsChatPrompt({
              role: "user",
              getSections: async ({ runState: { task } }) => [
                { title: "Task", content: task },
              ],
            }),
            $.prompt.recentStepsChatPrompt({ maxSteps: 10 })
          ),
          model,
        }),
      ],
    }),
    observer: $.agent.observer.combineObservers(
      $.agent.observer.showRunInConsole({ name: "JavaScript Developer Agent" }),
      {
        async onRunFinished({ run }) {
          const runCostInMillicent = await $.agent.calculateRunCostInMillicent({
            run,
          });

          console.log(
            `Run cost: $${(runCostInMillicent / 1000 / 100).toFixed(2)}`
          );

          console.log(
            `LLM calls: ${
              run.recordedCalls.filter((call) => call.success).length
            }`
          );
        },
      }
    ),
  });
}
