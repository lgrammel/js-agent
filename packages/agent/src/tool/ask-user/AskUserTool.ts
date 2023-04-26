import readline from "readline";
import zod from "zod";
import { BasicToolAction, FormatResultFunction } from "../../action";
import { ExecuteBasicToolFunction } from "../../action/ExecuteBasicToolFunction";

export type AskUserInput = {
  query: string;
};

export type AskUserOutput = {
  response: string;
};

export const askUser = ({
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
  execute: ExecuteBasicToolFunction<AskUserInput, AskUserOutput>;
  formatResult?: FormatResultFunction<AskUserInput, AskUserOutput>;
}): BasicToolAction<AskUserInput, AskUserOutput> => ({
  type: "basic-tool",
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
  (): ExecuteBasicToolFunction<AskUserInput, AskUserOutput> =>
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
