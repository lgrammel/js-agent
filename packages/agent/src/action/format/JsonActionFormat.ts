import { ActionParameters, actionParametersSchema } from "../ActionParameters";
import { ActionFormat } from "./ActionFormat";
import SecureJSON from "secure-json-parse";

/**
 * Class for handling JSON action formats.
 */
export class JsonActionFormat implements ActionFormat {
  /**
   * A description of the JSON action format.
   */
  description = "JSON";

  /**
   * Formats the given action parameters into a JSON string.
   *
   * @param parameters - The action parameters to format.
   * @returns The formatted JSON string.
   */
  format(parameters: ActionParameters): string {
    return JSON.stringify(parameters, null, 2);
  }

  /**
   * Parses the given text into action parameters, handling JSON objects and free text.
   *
   * @param text - The text to parse.
   * @returns The parsed action parameters.
   */
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
