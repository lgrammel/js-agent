import { Agent } from "./Agent";
import { AgentRunObserver } from "./AgentRunObserver";

export const runCLIAgent = ({
  agent,
  observer,
}: {
  agent: Agent;
  observer: AgentRunObserver;
}) => {
  agent
    .run({
      // TODO rename to objective
      objective: process.argv.slice(2).join(" "),
      observer,
    })
    .then(() => {})
    .catch((error) => {
      console.error("Error running instructions:", error);
    });
};
