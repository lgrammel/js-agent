import { StepFactory } from "../step/StepFactory";
import { maxSteps } from "./controller/maxSteps";
import { Run } from "./Run";
import { RunController } from "./controller/RunController";
import { RunObserver } from "./observer/RunObserver";

export const runAgent = async ({
  agent,
  observer,
  controller = maxSteps(100),
  objective,
}: {
  agent: StepFactory;
  controller?: RunController;
  observer: RunObserver;
  objective: string;
}) => {
  const run = new Run({
    controller,
    observer,
    objective,
  });

  const rootStep = await agent(run);
  run.root = rootStep;

  run.onStart();

  const result = await rootStep.execute();

  run.onFinish({ result });
};
