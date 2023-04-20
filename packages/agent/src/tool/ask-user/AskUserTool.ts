import zod from "zod";
import { createToolAction } from "../ToolAction";
import { ExecuteToolFunction } from "../ExecuteToolFunction";
import { FormatResultFunction } from "../../action";
import readline from "readline";

export type AskUserInput = {
  query: string;
};

export type AskUserOutput = {
  response: string;
};

export const askUser = <RUN_PROPERTIES>({
  id = "ask-user",
  description = "Ask the user for input or to take an action.",
  inputExample = {
    query: "{question or action description}",
  },
  execute,
  formatResult = ({ input, output: { response } }) =>
    `${input.query}: ${response}`,
}: {
  id?: string;
  description?: string;
  inputExample?: AskUserInput;
  execute: ExecuteToolFunction<AskUserInput, AskUserOutput, RUN_PROPERTIES>;
  formatResult?: FormatResultFunction<AskUserInput, AskUserOutput>;
}) =>
  createToolAction({
    id,
    description,
    inputSchema: zod.object({
      query: zod.string(),
    }),
    outputSchema: zod.object({
      response: zod.string(),
    }),
    inputExample,
    execute,
    formatResult,
  });

export const executeAskUser =
  <RUN_PROPERTIES>(): ExecuteToolFunction<
    AskUserInput,
    AskUserOutput,
    RUN_PROPERTIES
  > =>
  async ({ input: { query } }) => {
    const userInput = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const response = await new Promise<string>((resolve) => {
      userInput.question(query, (answer) => {
        resolve(answer);
        userInput.close();
      });
    });

    return {
      summary: `User response: ${response}`,
      output: { response },
    };
  };
