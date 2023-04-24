import { StepFactory } from "../step/StepFactory";
import { maxSteps } from "./controller/maxSteps";
import { Run } from "./Run";
import { RunController } from "./controller/RunController";
import { RunObserver } from "./observer/RunObserver";

export const runAgent = async <RUN_STATE>({
  agent,
  observer,
  controller = maxSteps(100),
  properties,
}: {
  agent: StepFactory<RUN_STATE>;
  controller?: RunController<RUN_STATE>;
  observer: RunObserver<RUN_STATE>;
  properties: RUN_STATE;
}) => {
  const run = new Run<RUN_STATE>({
    controller,
    observer,
    initialState: properties,
  });

  const rootStep = await agent(run);
  run.root = rootStep;

  run.onStart();

  const result = await rootStep.execute();

  run.onFinish({ result });
};
