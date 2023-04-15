import $ from "@gptagent/agent";

$.tool.executor.runToolExecutor({
  tools: [
    $.tool.readFile({
      execute: $.tool.executeReadFile({
        workspacePath: process.env.WORKSPACE,
      }),
    }),
    $.tool.writeFile({
      execute: $.tool.executeWriteFile({
        workspacePath: process.env.WORKSPACE,
      }),
    }),
    $.tool.runCommand({
      execute: $.tool.executeRunCommand({
        workspacePath: process.env.WORKSPACE,
      }),
    }),
  ],
});
