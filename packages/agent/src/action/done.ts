import zod from "zod";
import { CustomStepAction } from "./Action";
import { NoopStep } from "../step/NoopStep";

type DoneActionInput = {
  _freeText?: string;
  result: string;
};

export const done = <RUN_STATE>({
  id = "custom-step",
  description = "Indicate that you are done with the task.",
}: {
  id?: string;
  description?: string;
} = {}): CustomStepAction<DoneActionInput, {}, RUN_STATE> => ({
  type: "custom-step",
  id,
  description,
  inputSchema: zod.object({
    result: zod.string(),
  }),
  inputExample: {
    result: "{result of the task}",
  },
  outputSchema: zod.object({}),
  createStep: async ({ input: { result }, run }) => {
    return new NoopStep({
      type: id,
      run,
      summary: result,
      isDoneStep: true,
    });
  },
});
