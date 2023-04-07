import $, { ActionRegistry, Agent, runAgent } from "@gptagent/agent";

const remoteToolExecutor = new $.action.tool.RemoteToolExecutor({
  baseUrl: "http://localhost:3001",
});

runAgent({
  agent: new Agent({
    name: "JavaScript Developer",
    role: `You are a software developer that creates and modifies JavaScript programs.
You are working in a Linux environment.
You have access to a GitHub repository (current folder).`,
    constraints: `You must verify that the changes that you make are working.`,
    actionRegistry: new ActionRegistry({
      actions: [
        new $.action.tool.ReadFileAction({ executor: remoteToolExecutor }),
        new $.action.tool.WriteFileAction({ executor: remoteToolExecutor }),
        new $.action.tool.RunCommandAction({ executor: remoteToolExecutor }),
      ],
      format: new $.action.format.JsonActionFormat(),
    }),
  }),
});
