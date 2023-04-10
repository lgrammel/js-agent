import { Action } from "../Action";
import { ActionParameters } from "../ActionParameters";

export interface ToolExecutor<INPUT extends ActionParameters, OUTPUT> {
  execute({}: {
    input: INPUT;
    action: Action<INPUT, OUTPUT>;
    context: {
      workspacePath: string; // TODO this does not belong here
    };
  }): Promise<{ output: OUTPUT; summary: string }>;
}
