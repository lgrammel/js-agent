import $, { ActionRegistry, Agent, runCLIAgent } from "@gptagent/agent";
import dotenv from "dotenv";

// PROJECT AND ROLE CONFIGURATION

const role = `You are a software developer that creates and modifies JavaScript programs.
You are working in a Linux environment.`;

const project = `You are working on a JavaScript/TypeScript project called "gptagent.js".
The project uses pnpm for package management.
The main package is located in the "packages/agent" directory.

Gptagent.js uses vitest for unit testing.
Unit tests are written using vitest and have a .test.ts ending.
Unit tests are in the same folder as the files that are tested.
When writing tests, first read the production code and then write the tests.
You can run the tests with "ai-bin/test-agent.sh".`;

const constraints = `You must verify that the changes that you make are working.`;

const setupCommands = ["pnpm install", "pnpm nx run agent:build"];

// AGENT SETUP

dotenv.config();

const textGenerator = new $.ai.openai.Gpt4ChatTextGenerator({
  apiKey: process.env.OPENAI_API_KEY,
});

const remoteToolExecutor = new $.action.tool.RemoteToolExecutor({
  baseUrl: "http://localhost:3001",
});

const resultFormatters = new $.action.ResultFormatterRegistry([
  new $.action.tool.ReadFileResultFormatter(),
  new $.action.tool.RunCommandResultFormatter(),
  new $.action.tool.WriteFileResultFormatter(),
]);

const runCommandAction = new $.action.tool.RunCommandAction({
  executor: remoteToolExecutor,
});

const actions = [
  new $.action.tool.ReadFileAction({ executor: remoteToolExecutor }),
  new $.action.tool.WriteFileAction({ executor: remoteToolExecutor }),
  runCommandAction,
  new $.action.DoneAction({
    type: "user-action",
    text: "Indicate that the user needs to take an action.",
  }),
];

runCLIAgent({
  agent: new Agent({
    name: "JavaScript Developer",
    rootStep: new $.step.FixedCompositeStep({
      steps: [
        new $.step.FixedCompositeStep({
          steps: await (async () => {
            const steps = [];
            for (const command of setupCommands) {
              steps.push(
                await runCommandAction.createStep({
                  input: { command },
                })
              );
            }
            return steps;
          })(),
        }),
        new $.step.DynamicCompositeStep({
          nextStepGenerator: new $.step.BasicNextStepGenerator({
            instructionSections: [
              { title: "ROLE", content: role },
              { title: "PROJECT", content: project },
              { title: "CONSTRAINTS", content: constraints },
            ],
            actionRegistry: new ActionRegistry({
              actions,
              format: new $.action.format.JsonActionFormat(),
            }),
            resultFormatterRegistry: resultFormatters,
            textGenerator,
          }),
        }),
      ],
    }),
  }),
  resultFormatters,
});
