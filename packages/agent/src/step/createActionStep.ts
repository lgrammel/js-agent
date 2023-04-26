import { ActionParameters } from "../action";
import { AnyAction } from "../action/Action";
import { Run } from "../agent/Run";
import { BasicToolStep } from "../tool/BasicToolStep";
import { ReflectiveToolStep } from "../tool/ReflectiveToolStep";
import { NoopStep } from "./NoopStep";

export async function createActionStep<RUN_STATE>({
  action,
  input,
  run,
}: {
  action: AnyAction<RUN_STATE>;
  input: ActionParameters;
  run: Run<RUN_STATE>;
}) {
  const actionType = action.type;
  switch (actionType) {
    case "done": {
      return new NoopStep({
        type: action.id,
        run,
        summary: input._freeText ?? "Done.",
        isDoneStep: true,
      });
    }
    case "basic-tool": {
      return new BasicToolStep({
        action,
        input,
        run,
      });
    }
    case "reflective-tool": {
      return new ReflectiveToolStep({
        action,
        input,
        run,
      });
    }
    default: {
      const unsupportedActionType: never = actionType;
      throw new Error(`Unsupported action type: ${unsupportedActionType}`);
    }
  }
}
