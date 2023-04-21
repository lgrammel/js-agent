import { ActionParameters, actionParametersSchema } from "../ActionParameters";
import { ActionFormat } from "./ActionFormat";
import SecureJSON from "secure-json-parse";

/**
 * Parses the first JSON object that it
 * finds in the response and is better suited for `gpt-3.5-turbo`, which does not
 * reliably insert the JSON object at the end of the response.
 */
export const flexibleJson = (): ActionFormat => ({
  description: "JSON",

  format(parameters: ActionParameters): string {
    return JSON.stringify(parameters, null, 2);
  },

  parse(text: string): ActionParameters {
    const [jsonObject, freeText] = extractFirstSingleLevelJsonObject(text);

    if (jsonObject == null) {
      return { _freeText: freeText };
    }

    try {
      return {
        ...actionParametersSchema.parse(jsonObject),
        _freeText: freeText.trim(),
      };
    } catch (error: any) {
      throw new Error(
        `${text} could not be parsed as JSON: ${error?.message ?? error}`
      );
    }
  },
});

function extractFirstSingleLevelJsonObject(
  text: string
): [object | null, string] {
  const jsonStartIndex = text.indexOf("{");

  // assumes no nested objects:
  const jsonEndIndex = text.indexOf("}", jsonStartIndex);

  if (
    jsonStartIndex === -1 ||
    jsonEndIndex === -1 ||
    jsonStartIndex > jsonEndIndex
  ) {
    return [null, text];
  }

  const jsonString = text.slice(jsonStartIndex, jsonEndIndex + 1);
  let jsonObject: object | null = null;

  try {
    jsonObject = SecureJSON.parse(jsonString);
  } catch (error) {
    return [null, text];
  }

  const textBeforeJson = text.slice(0, jsonStartIndex);
  const textAfterJson = text.slice(jsonEndIndex + 1);

  return [jsonObject, textBeforeJson + textAfterJson];
}
