import $, { ActionRegistry, Agent, runCLIAgent } from "@gptagent/agent";
import dotenv from "dotenv";
import fs from "node:fs";

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

// load json file "project.json" from the current folder with node:
const project = JSON.parse(fs.readFileSync("project.json", "utf8"));

runCLIAgent({
  agent: new Agent({
    name: "JavaScript Developer",
    rootStep: new $.step.DynamicCompositeStep({
      nextStepGenerator: new $.step.BasicNextStepGenerator({
        instructionSections: [
          {
            title: "ROLE",
            content: `You are a software developer that creates and modifies JavaScript programs.
You are working in a Linux environment.`,
          },
          {
            title: "CONSTRAINTS",
            content: `You must verify that the changes that you make are working.`,
          },
        ],
        actionRegistry: new ActionRegistry({
          actions: [
            new $.action.tool.ReadFileAction({ executor: remoteToolExecutor }),
            new $.action.tool.WriteFileAction({ executor: remoteToolExecutor }),
            new $.action.tool.RunCommandAction({
              executor: remoteToolExecutor,
            }),
            new $.action.DoneAction({
              type: "user-action",
              text: "Indicate that the user needs to take an action.",
            }),
          ],
          format: new $.action.format.JsonActionFormat(),
        }),
        resultFormatterRegistry: resultFormatters,
        textGenerator,
      }),
    }),
  }),
  resultFormatters,
});
