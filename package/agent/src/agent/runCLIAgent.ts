import chalk from "chalk";
import { Agent } from "./Agent";

const log = console.log;

export const runCLIAgent = ({ agent }: { agent: Agent }) => {
  agent
    .run({
      instructions: process.argv.slice(2).join(" "),
      observer: {
        onAgentRunStarted({ instructions }) {
          log(chalk.green(`### ${agent.name} ###`));
          log(instructions);
          log();
        },

        onAgentRunFinished({ result }) {
          log(chalk.gray("Done"));
        },

        onStepGenerationStarted({ messages }) {
          log(chalk.gray("Thinking..."));
        },
        onStepGenerated({ completion }) {
          log(chalk.cyanBright(completion));
          log();
        },
        onActionExecutionStarted({ actionType, action }) {
          log(chalk.gray(`Execute action ${actionType}`));
        },
        onActionExecutionFinished({ actionType, action, result }) {
          log(chalk.green(result.summary));
          log();
        },
        onActionExecutionFailed({ actionType, action, error }) {
          log(chalk.red("Error"));
          log(chalk.red(error));
        },
      },
    })
    .then(() => {})
    .catch((error) => {
      console.error("Error running instructions:", error);
    });
};
