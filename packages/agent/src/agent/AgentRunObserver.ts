import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { Step } from "../step/Step";
import { AgentRun } from "./AgentRun";

export interface AgentRunObserver {
  onAgentRunStarted?: ({}: { run: AgentRun }) => void;
  // TODO result should be a StepResult:
  onAgentRunFinished?: ({}: { run: AgentRun; result: unknown }) => void;

  // TODO is this necessary? if so, how?
  onStepGenerationStarted?: ({}: {
    run: AgentRun;
    messages: Array<OpenAIChatMessage>;
  }) => void;
  onStepGenerationFinished?: ({}: {
    run: AgentRun;
    generatedText: string;
    step: Step;
  }) => void;

  onLoopIterationStarted?: ({}: { run: AgentRun; loop: Step }) => void;
  onLoopIterationFinished?: ({}: { run: AgentRun; loop: Step }) => void;

  onStepExecutionStarted?: ({}: { run: AgentRun; step: Step }) => void;
  onStepExecutionFinished?: ({}: { run: AgentRun; step: Step }) => void;
}
