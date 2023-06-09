import axios from "axios";
import { BasicToolAction } from "../action/Action";
import { ActionParameters } from "../action/ActionParameters";
import { ExecuteBasicToolFunction } from "../action/ExecuteBasicToolFunction";

export const executeRemoteTool =
  <INPUT extends ActionParameters, OUTPUT>({
    baseUrl,
  }: {
    baseUrl: string;
  }): ExecuteBasicToolFunction<INPUT, OUTPUT> =>
  async ({
    input,
    action,
  }: {
    input: INPUT;
    action: BasicToolAction<INPUT, OUTPUT>;
  }): Promise<{ output: OUTPUT; summary: string }> => {
    try {
      const parametersJson = JSON.stringify(input);

      const response = await axios.post(
        `${baseUrl}/tool/${action.id}`, // TODO flexible location
        parametersJson,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data; // data is already parsed JSON

      // TODO safely parse + zod validate
      // const resultSchema: zod.Schema<{
      //   summary: string;
      //   output: OUTPUT;
      // }> = zod.object({
      //   summary: zod.string(),
      //   output: action.outputSchema,
      // });

      return result as {
        summary: string;
        output: OUTPUT;
      }; // TODO remove
    } catch (error: any) {
      // TODO better error handling
      console.error("Error sending command:", error.message);
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios error details:",
          error.response?.data,
          error.response?.status,
          error.response?.headers
        );
      }
      return {
        summary: "Error executing command",
        output: error.response?.data,
      };
    }
  };
