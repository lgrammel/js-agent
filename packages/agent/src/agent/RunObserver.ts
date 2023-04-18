import { StepResult } from "../step";
import { Loop } from "../step/Loop";
import { Step } from "../step/Step";
import { Run } from "./Run";

export type RunObserver = {
  onRunStarted?: ({}: { run: Run }) => void;
  onRunFinished?: ({}: { run: Run; result: StepResult }) => void;

  onStepGenerationStarted?: ({}: { run: Run }) => void;
  onStepGenerationFinished?: ({}: {
    run: Run;
    generatedText: string;
    step: Step;
  }) => void;

  onLoopIterationStarted?: ({}: { run: Run; loop: Loop }) => void;
  onLoopIterationFinished?: ({}: { run: Run; loop: Loop }) => void;

  onStepExecutionStarted?: ({}: { run: Run; step: Step }) => void;
  onStepExecutionFinished?: ({}: {
    run: Run;
    step: Step;
    result: StepResult;
  }) => void;
};
