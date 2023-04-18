import { StepFactory } from "../step/StepFactory";
import { MaxStepsRunController } from "./MaxStepsRunController";
import { Run } from "./Run";
import { RunController } from "./RunController";
import { RunObserver } from "./RunObserver";

export const runAgent = async ({
  agent,
  observer,
  controller = new MaxStepsRunController({ maxSteps: 100 }),
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
