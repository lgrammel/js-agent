import { Action } from "../Action";
import { ActionParameters } from "../ActionParameters";

export interface ToolExecutor<
  INPUT extends ActionParameters,
  OUTPUT extends Record<string, string | undefined>
> {
  execute({}: {
    input: INPUT;
    action: Action<INPUT, OUTPUT>;
    workspacePath: string; // TODO this does not belong here
  }): Promise<{ output: OUTPUT; summary: string }>;
}
