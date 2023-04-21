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

  type RunProperties = {
    task: string;
    projectInstructions: string;
  };

  return $.runAgent({
    properties: { task, projectInstructions },
    agent: $.step.createFixedStepsLoop({
      steps: [
        $.step.createFixedStepsLoop({
          type: "setup",
          steps: setupCommands.map(
            (command) => async (run) =>
              $.tool.runCommand({ execute: executeRemote }).createStep({
                input: { command },
                run,
              }) as Promise<$.step.Step<RunProperties>>
          ),
        }),
        $.step.createGenerateNextStepLoop({
          prompt: $.prompt.concatChatPrompts<
            $.step.GenerateNextStepLoopContext<RunProperties>
          >(
            $.prompt.sectionsChatPrompt({
              role: "system",
              getSections: async ({
                runProperties: { projectInstructions },
              }) => [
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
              getSections: async ({ runProperties: { task } }) => {
                return [{ title: "Task", content: task }];
              },
            }),
            $.prompt.recentStepsChatPrompt({ maxSteps: 10 })
          ),
          model,
          actionRegistry: new $.action.ActionRegistry({
            actions: [
              $.tool.readFile({ execute: executeRemote }),
              $.tool.writeFile({ execute: executeRemote }),
              $.tool.runCommand({ execute: executeRemote }),
              $.tool.askUser({
                execute: $.tool.executeAskUser(),
              }),
            ],
            format: new $.action.format.JsonActionFormat(),
          }),
        }),
      ],
    }),
    observer: $.agent.observer.showRunInConsole({
      name: "JavaScript Developer Agent",
    }),
  });
}
