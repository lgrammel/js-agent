import { Action } from "./Action";
import zod from "zod";

export class DoneAction implements Action<{}, {}> {
  type = "done";
  description = "Indicate that you are done with the task.";

  inputSchema = zod.object({});
  outputSchema = zod.object({});
}
