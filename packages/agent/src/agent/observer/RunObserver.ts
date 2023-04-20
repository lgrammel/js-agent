import { StepResult } from "../../step";
import { Loop } from "../../step/Loop";
import { Step } from "../../step/Step";
import { Run } from "../Run";

export type RunObserver<RUN_PROPERTIES> = {
  onRunStarted?: (_: { run: Run<RUN_PROPERTIES> }) => void;
  onRunFinished?: (_: { run: Run<RUN_PROPERTIES>; result: StepResult }) => void;

  onStepGenerationStarted?: (_: { run: Run<RUN_PROPERTIES> }) => void;
  onStepGenerationFinished?: (_: {
    run: Run<RUN_PROPERTIES>;
    generatedText: string;
    step: Step<RUN_PROPERTIES>;
  }) => void;

  onLoopIterationStarted?: (_: {
    run: Run<RUN_PROPERTIES>;
    loop: Loop<RUN_PROPERTIES>;
  }) => void;
  onLoopIterationFinished?: (_: {
    run: Run<RUN_PROPERTIES>;
    loop: Loop<RUN_PROPERTIES>;
  }) => void;

  onStepExecutionStarted?: (_: {
    run: Run<RUN_PROPERTIES>;
    step: Step<RUN_PROPERTIES>;
  }) => void;
  onStepExecutionFinished?: (_: {
    run: Run<RUN_PROPERTIES>;
    step: Step<RUN_PROPERTIES>;
    result: StepResult;
  }) => void;
};
