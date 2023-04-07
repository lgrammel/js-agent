import $, { ActionRegistry, Agent, runAgent } from "@gptagent/agent";

runAgent({
  agent: new Agent({
    name: "JavaScript Developer",
    role: `You are a software developer that creates and modifies JavaScript programs.
You are working in a Linux environment.
You have access to a GitHub repository (current folder).`,
    constraints: `You must verify that the changes that you make are working.`,
    actionRegistry: new ActionRegistry({
      actions: [
        new $.action.tool.ReadFileAction({
          executor: new $.action.tool.RemoteToolExecutor(),
        }),
        new $.action.tool.WriteFileAction({
          executor: new $.action.tool.RemoteToolExecutor(),
        }),
        new $.action.tool.RunCommandAction({
          executor: new $.action.tool.RemoteToolExecutor(),
        }),
      ],
      format: new $.action.format.JsonActionFormat(),
    }),
  }),
});
