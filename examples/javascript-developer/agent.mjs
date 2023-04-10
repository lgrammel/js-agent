import $, { ActionRegistry, Agent, runCLIAgent } from "@gptagent/agent";
import dotenv from "dotenv";

dotenv.config();

const textGenerator = new $.ai.openai.Gpt4ChatTextGenerator({
  apiKey: process.env.OPENAI_API_KEY,
});

const remoteToolExecutor = new $.action.tool.RemoteToolExecutor({
  baseUrl: "http://localhost:3001",
});

runCLIAgent({
  agent: new Agent({
    name: "JavaScript Developer",
    rootStep: new $.step.DynamicCompositeStep({
      nextStepGenerator: new $.step.BasicNextStepGenerator({
        role: `You are a software developer that creates and modifies JavaScript programs.
You are working in a Linux environment.
You have access to a GitHub repository (current folder).`,
        constraints: `You must verify that the changes that you make are working.`,
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
        resultFormatterRegistry: new $.action.ResultFormatterRegistry([
          new $.action.tool.RunCommandResultFormatter(),
        ]),
        textGenerator,
      }),
    }),
  }),
});
