import { ActionParameters, actionParametersSchema } from "../ActionParameters";
import { ActionFormat } from "./ActionFormat";
import SecureJSON from "secure-json-parse";

export class JsonActionFormat implements ActionFormat {
  description = "JSON";

  format(parameters: ActionParameters): string {
    return JSON.stringify(parameters, null, 2);
  }

  parse(text: string): ActionParameters {
    if (!text.trim().endsWith("}")) {
      return { _freeText: text };
    }

    try {
      const firstOpeningBraceIndex = text.indexOf("{");
      const freeText = text.slice(0, firstOpeningBraceIndex);
      const jsonText = text.slice(firstOpeningBraceIndex);
      const jsonObject = SecureJSON.parse(jsonText);

      return {
        ...actionParametersSchema.parse(jsonObject),
        _freeText: freeText.trim(),
      };
    } catch (error: any) {
      throw new Error(
        `${text} could not be parsed as JSON: ${error?.message ?? error}`
      );
    }
  }
}
