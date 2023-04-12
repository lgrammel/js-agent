import { Action } from "../Action";
import { ActionParameters } from "../ActionParameters";

export interface ToolExecutor<INPUT extends ActionParameters, OUTPUT> {
  execute({}: {
    input: INPUT;
    action: Action<INPUT, OUTPUT>;
  }): Promise<{ output: OUTPUT; summary: string }>;
}
