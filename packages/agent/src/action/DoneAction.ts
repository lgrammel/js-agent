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
  readonly type: string;
  readonly description: string;

  readonly inputSchema = zod.object({});
  readonly outputSchema = zod.object({});

  constructor({
    type = "done",
    description = "Indicate that you are done with the task.",
  }: {
    type?: string;
    description?: string;
  } = {}) {
    this.type = type;
    this.description = description;
  }

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
