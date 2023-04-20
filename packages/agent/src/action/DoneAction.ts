import { Run } from "../agent";
import { NoopStep } from "../step/NoopStep";
import { Action } from "./Action";
import zod from "zod";

export const done = <RUN_PROPERTIES>({
  id = "done",
  description = "Indicate that you are done with the task.",
}: {
  id?: string;
  description?: string;
} = {}): Action<{ _freeText?: string }, {}, RUN_PROPERTIES> => ({
  id,
  description,
  inputSchema: zod.object({}),
  outputSchema: zod.object({}),
  async createStep({
    input,
    run,
  }: {
    run: Run<RUN_PROPERTIES>;
    input: { _freeText?: string };
  }) {
    return new NoopStep({
      type: id,
      run,
      summary: input._freeText ?? "Done.",
      isDoneStep: true,
    });
  },
});
