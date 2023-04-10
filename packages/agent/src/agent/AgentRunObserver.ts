import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { Step } from "../step/Step";
import { StepResult } from "../step/StepResult";
import { AgentRun } from "./AgentRun";

export interface AgentRunObserver {
  onAgentRunStarted({}: { run: AgentRun }): void;
  onAgentRunFinished({}: { run: AgentRun; result: unknown }): void;

  onStepGenerationStarted({}: {
    run: AgentRun;
    messages: Array<OpenAIChatMessage>;
  }): void;
  onStepGenerationFinished({}: {
    run: AgentRun;
    generatedText: string;
    step: Step;
  }): void;

  onStepExecutionStarted({}: { run: AgentRun; step: Step }): void;
  onStepExecutionFinished({}: {
    run: AgentRun;
    step: Step;
    result: StepResult;
  }): void;
}
