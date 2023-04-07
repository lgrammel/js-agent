import { ActionParameters } from "../ActionParameters";

export interface ActionFormat {
  description: string | undefined;
  format(parameters: ActionParameters): string;
  parse(text: string): ActionParameters;
}
