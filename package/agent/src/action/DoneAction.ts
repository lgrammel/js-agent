import { NoopStep } from "../step/NoopStep";
import { Action } from "./Action";
import zod from "zod";

export class DoneAction
  implements
    Action<
      {
        _freeText?: string;
      },
      {}
    >
{
  type = "done";
  description = "Indicate that you are done with the task.";

  inputSchema = zod.object({});
  outputSchema = zod.object({});

  async createStep({
    input,
    generatedText,
  }: {
    generatedText?: string;
    input: { _freeText?: string };
  }) {
    return new NoopStep({
      type: this.type,
      generatedText,
      summary: input._freeText,
      isDoneStep: true,
    });
  }
}
