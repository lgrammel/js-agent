import { MaxStepAbortController } from "../step/MaxStepAbortController";
import { StepFactory } from "../step/StepFactory";
import { Run } from "./Run";
import { RunObserver } from "./RunObserver";

export const runAgent = async ({
  agent,
  observer,
  objective,
}: {
  agent: StepFactory;
  observer: RunObserver;
  objective: string;
}) => {
  const run = new Run({
    controller: new MaxStepAbortController({ maxSteps: 100 }),
    observer,
    objective,
  });

  const rootStep = await agent(run);

  run.onStart();

  const result = await rootStep.execute();

  run.onFinish({ result });
};
