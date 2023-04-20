import { StepFactory } from "../step/StepFactory";
import { maxSteps } from "./controller/maxSteps";
import { Run } from "./Run";
import { RunController } from "./controller/RunController";
import { RunObserver } from "./observer/RunObserver";

export const runAgent = async <RUN_PROPERTIES>({
  agent,
  observer,
  controller = maxSteps(100),
  properties,
}: {
  agent: StepFactory<RUN_PROPERTIES>;
  controller?: RunController<RUN_PROPERTIES>;
  observer: RunObserver<RUN_PROPERTIES>;
  properties: RUN_PROPERTIES;
}) => {
  const run = new Run<RUN_PROPERTIES>({
    controller,
    observer,
    properties,
  });

  const rootStep = await agent(run);
  run.root = rootStep;

  run.onStart();

  const result = await rootStep.execute();

  run.onFinish({ result });
};
