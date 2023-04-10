import axios from "axios";
import { ToolExecutor } from "./ToolExecutor";
import { Action } from "../Action";
import { ActionParameters } from "../ActionParameters";

export class RemoteToolExecutor<INPUT extends ActionParameters, OUTPUT>
  implements ToolExecutor<INPUT, OUTPUT>
{
  private readonly baseUrl: string;

  constructor({ baseUrl }: { baseUrl: string }) {
    this.baseUrl = baseUrl;
  }

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
        `${this.baseUrl}/tool/${action.type}`, // TODO flexible location
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
