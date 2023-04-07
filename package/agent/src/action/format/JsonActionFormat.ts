import { ActionParameters, actionParametersSchema } from "../ActionParameters";
import { ActionFormat } from "./ActionFormat";
import SecureJSON from "secure-json-parse";

export class JsonActionFormat implements ActionFormat {
  description = "JSON";

  format(parameters: ActionParameters): string {
    return JSON.stringify(parameters, null, 2);
  }

  parse(text: string): ActionParameters {
    try {
      const parsedJson = SecureJSON.parse(text);
      return actionParametersSchema.parse(parsedJson);
    } catch (error: any) {
      throw new Error(
        `${text} could not be parsed as JSON: ${error?.message ?? error}`
      );
    }
  }
}
