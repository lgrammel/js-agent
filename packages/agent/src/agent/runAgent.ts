import { MaxStepAbortController } from "../step/MaxStepAbortController";
import { StepFactory } from "../step/StepFactory";
import { AgentRun } from "./AgentRun";
import { AgentRunObserver } from "./AgentRunObserver";

export const runAgent = async ({
  agent,
  observer,
  objective,
}: {
  agent: StepFactory;
  observer: AgentRunObserver;
  objective: string;
}) => {
  const run = new AgentRun({
    controller: new MaxStepAbortController({ maxSteps: 100 }),
    observer,
    objective,
  });

  const rootStep = await agent(run);

  run.onStart();

  const result = await rootStep.execute();

  run.onFinish({ result });
};
