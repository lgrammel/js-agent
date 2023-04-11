import { ActionParameters } from "../ActionParameters";

/**
 * Format for parsing/formatting actions from text.
 *
 * This is used to instruct the LLM how to execute actions and to parse the actions that the LLM wants to execute.
 */
export interface ActionFormat {
  /**
   * A description of the action format.
   */
  description: string | undefined;

  /**
   * Formats the given action parameters into a string.
   *
   * @param parameters - The action parameters to format.
   * @returns The formatted string.
   */
  format(parameters: ActionParameters): string;

  /**
   * Parses the given text into action parameters.
   *
   * @param text - The text to parse.
   * @returns The parsed action parameters.
   */
  parse(text: string): ActionParameters;
}
