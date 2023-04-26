import { ActionParameters } from "../action";
import { AnyAction } from "../action/Action";
import { Run } from "../agent/Run";
import { BasicToolStep } from "../tool/BasicToolStep";
import { ReflectiveToolStep } from "../tool/ReflectiveToolStep";

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
    case "custom-step": {
      return action.createStep({ input, run });
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
