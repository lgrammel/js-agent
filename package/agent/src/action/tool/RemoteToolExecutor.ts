import axios from "axios";
import { Action } from "../Action";
import { ActionParameters } from "../ActionParameters";
import { ToolExecutor } from "./ToolExecutor";

export class RemoteToolExecutor<
  INPUT extends ActionParameters,
  OUTPUT extends Record<string, string | undefined>
> implements ToolExecutor<INPUT, OUTPUT>
{
  async execute({
    input,
    action,
  }: {
    input: INPUT;
    action: Action<INPUT, OUTPUT>;
  }): Promise<{ output: OUTPUT; summary: string }> {
    try {
      const parametersJson = JSON.stringify(input);

      const response = await axios.post(
        `http://localhost:3001/tool/${action.type}`, // TODO flexible location
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
      throw error;
    }
  }
}
