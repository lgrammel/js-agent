import { ResultFormatterRegistry } from "../action";
import { Agent } from "./Agent";
import { CLIAgentRunObserver } from "./CLIAgentRunObserver";

export const runCLIAgent = ({
  agent,
  resultFormatters,
}: {
  agent: Agent;
  resultFormatters?: ResultFormatterRegistry;
}) => {
  agent
    .run({
      instructions: process.argv.slice(2).join(" "),
      observer: new CLIAgentRunObserver({
        resultFormatters,
      }),
    })
    .then(() => {})
    .catch((error) => {
      console.error("Error running instructions:", error);
    });
};
