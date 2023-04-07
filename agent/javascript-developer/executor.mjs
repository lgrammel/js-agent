import $, { runExecutor, ToolRegistry } from "@gptagent/agent";

runExecutor({
  tools: new ToolRegistry({
    tools: [
      new $.action.tool.ReadFileAction({
        executor: new $.action.tool.ReadFileExecutor(),
      }),
      new $.action.tool.WriteFileAction({
        executor: new $.action.tool.WriteFileExecutor(),
      }),
      new $.action.tool.RunCommandAction({
        executor: new $.action.tool.RunCommandExecutor(),
      }),
    ],
  }),
});
