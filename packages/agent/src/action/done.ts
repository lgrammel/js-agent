import zod from "zod";
import { CustomStepAction } from "./Action";
import { NoopStep } from "../step/NoopStep";

type DoneActionInput = {
  _freeText?: string;
  result: string;
};

export const done = <RUN_STATE>({
  id = "done",
  description = "Indicate that you are done with the task.",
  inputExample = {
    result: "{result of the task}",
  },
}: {
  id?: string;
  description?: string;
  inputExample?: DoneActionInput;
} = {}): CustomStepAction<DoneActionInput, {}, RUN_STATE> => ({
  type: "custom-step",
  id,
  description,
  inputSchema: zod.object({
    result: zod.string(),
  }),
  inputExample,
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
