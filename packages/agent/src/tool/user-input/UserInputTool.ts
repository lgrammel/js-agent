import zod from "zod";
import { createToolAction } from "../ToolAction";
import { ExecuteToolFunction } from "../ExecuteToolFunction";
import { FormatResultFunction } from "../../action";
import readline from "readline";

export type UserInputInput = {
  query: string;
};

export type UserInputOutput = {
  text: string;
};

export const getUserInput = ({
  id = "ask-user",
  description = "Ask the user for input or to take an action.",
  inputExample = {
    query: "{question or action description}",
  },
  execute,
  formatResult = ({ input, output: { text } }) => `${input.query}: ${text}`,
}: {
  id?: string;
  description?: string;
  inputExample?: UserInputInput;
  execute: ExecuteToolFunction<UserInputInput, UserInputOutput>;
  formatResult?: FormatResultFunction<UserInputInput, UserInputOutput>;
}) =>
  createToolAction({
    id,
    description,
    inputSchema: zod.object({
      query: zod.string(),
    }),
    outputSchema: zod.object({
      text: zod.string(),
    }),
    inputExample,
    execute,
    formatResult,
  });

export const executeUserInput =
  (): ExecuteToolFunction<UserInputInput, UserInputOutput> =>
  async ({ input: { query } }) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const text = await new Promise<string>((resolve) => {
      rl.question(query, (answer) => {
        resolve(answer);
        rl.close();
      });
    });

    return {
      summary: `User input: ${text}`,
      output: { text },
    };
  };
