import { Action } from "../action/Action";
import { ActionParameters } from "../action/ActionParameters";

export type ExecuteToolFunction<INPUT extends ActionParameters, OUTPUT> = ({}: {
  input: INPUT;
  action: Action<INPUT, OUTPUT>;
}) => Promise<{ output: OUTPUT; summary: string }>;
