import * as $ from "@gptagent/agent";

// PROJECT AND ROLE CONFIGURATION

const role = `You are a software developer that creates and modifies JavaScript programs.
You are working in a Linux environment.`;

const project = `You are working on a JavaScript/TypeScript project called "gptagent.js".
The project uses pnpm for package management.
The main package is located in the "packages/agent" directory.

Unit tests are written using jest and have a .test.ts ending.
Unit tests are in the same folder as the files that are tested.
When writing tests, first read the production code and then write the tests.
You can run the tests with "ai-bin/test-agent.sh".`;

const constraints = `You must verify that the changes that you make are working.`;

const setupCommands = ["pnpm install", "pnpm nx run agent:build"];

// AGENT

export async function runDeveloperAgent({
  openAiApiKey,
  objective,
}: {
  openAiApiKey: string;
  objective: string;
}) {
  const generateText = $.ai.openai.generateChatText({
    apiKey: openAiApiKey,
    model: "gpt-4",
  });

  const executeRemote = $.tool.executeRemoteTool({
    baseUrl: "http://localhost:3001",
  }) as any;

  return $.runAgent({
    agent: $.step.createFixedStepsLoop({
      steps: [
        $.step.createFixedStepsLoop({
          type: "setup",
          steps: setupCommands.map(
            (command) => async (run) =>
              $.tool.runCommand({ execute: executeRemote }).createStep({
                input: { command },
                run,
              })
          ),
        }),
        $.step.createGenerateNextStepLoop({
          prompt: new $.prompt.CompositePrompt(
            new $.prompt.FixedSectionsPrompt({
              sections: [
                { title: "role", content: role },
                { title: "project", content: project },
                { title: "constraints", content: constraints },
              ],
            }),
            new $.prompt.AvailableActionsSectionPrompt(),
            new $.prompt.TaskSectionPrompt(),
            new $.prompt.RecentStepsPrompt({
              maxSteps: 10,
            })
          ),
          actionRegistry: new $.action.ActionRegistry({
            actions: [
              $.tool.readFile({ execute: executeRemote }),
              $.tool.writeFile({ execute: executeRemote }),
              $.tool.runCommand({ execute: executeRemote }),
              $.action.done({
                id: "user-action",
                description: "Indicate that the user needs to take an action.",
              }),
            ],
            format: new $.action.format.JsonActionFormat(),
          }),
          generateText,
        }),
      ],
    }),
    observer: $.agent.outputAgentRunOnConsole({
      name: "JavaScript Developer Agent",
    }),
    objective,
  });
}
