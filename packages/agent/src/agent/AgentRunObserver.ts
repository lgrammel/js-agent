import { StepResult } from "../step";
import { Loop } from "../step/Loop";
import { Step } from "../step/Step";
import { AgentRun } from "./AgentRun";

export type AgentRunObserver = {
  onAgentRunStarted?: ({}: { run: AgentRun }) => void;
  // TODO result should be a StepResult:
  onAgentRunFinished?: ({}: { run: AgentRun; result: unknown }) => void;

  onStepGenerationStarted?: ({}: { run: AgentRun }) => void;
  onStepGenerationFinished?: ({}: {
    run: AgentRun;
    generatedText: string;
    step: Step;
  }) => void;

  onLoopIterationStarted?: ({}: { run: AgentRun; loop: Loop }) => void;
  onLoopIterationFinished?: ({}: { run: AgentRun; loop: Loop }) => void;

  onStepExecutionStarted?: ({}: { run: AgentRun; step: Step }) => void;
  onStepExecutionFinished?: ({}: {
    run: AgentRun;
    step: Step;
    result: StepResult;
  }) => void;
};
