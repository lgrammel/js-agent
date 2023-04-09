import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { Agent } from "./Agent";

export interface AgentRunObserver {
  onAgentRunStarted({}: { agent: Agent; instructions: string }): void;
  onAgentRunFinished({}: { agent: Agent; result: unknown }): void;

  onStepGenerationStarted({}: {
    agent: Agent;
    messages: Array<OpenAIChatMessage>;
  }): void;
  onStepGenerated({}: { agent: Agent; completion: string }): void;

  onActionExecutionStarted({}: {
    agent: Agent;
    actionType: string;
    action: unknown;
  }): void;
  onActionExecutionFinished({}: {
    agent: Agent;
    actionType: string;
    action: unknown;
    result: {
      summary: string;
      output: unknown;
    };
  }): void;
  onActionExecutionFailed({}: {
    agent: Agent;
    actionType: string;
    action: unknown;
    error: unknown;
  }): void;
}
