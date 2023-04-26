import zod from "zod";
import { DoneAction } from "./Action";

export const done = ({
  id = "done",
  description = "Indicate that you are done with the task.",
}: {
  id?: string;
  description?: string;
} = {}): DoneAction<{ _freeText?: string }, {}> => ({
  type: "done",
  id,
  description,
  inputSchema: zod.object({}),
  outputSchema: zod.object({}),
});
