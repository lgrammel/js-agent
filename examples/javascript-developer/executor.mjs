import $, { runExecutor, ToolRegistry } from "@gptagent/agent";

runExecutor({
  tools: new ToolRegistry({
    tools: [
      new $.action.tool.ReadFileAction({
        executor: new $.action.tool.ReadFileExecutor({
          workspacePath: process.env.WORKSPACE,
        }),
      }),
      new $.action.tool.WriteFileAction({
        executor: new $.action.tool.WriteFileExecutor({
          workspacePath: process.env.WORKSPACE,
        }),
      }),
      new $.action.tool.RunCommandAction({
        executor: new $.action.tool.RunCommandExecutor({
          workspacePath: process.env.WORKSPACE,
        }),
      }),
    ],
  }),
});
