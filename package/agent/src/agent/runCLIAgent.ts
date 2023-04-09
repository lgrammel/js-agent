import chalk from "chalk";
import { ToolStep } from "../action/tool/ToolStep";
import { Agent } from "./Agent";

const log = console.log;

export const runCLIAgent = ({ agent }: { agent: Agent }) => {
  agent
    .run({
      instructions: process.argv.slice(2).join(" "),
      observer: {
        onAgentRunStarted({ run }) {
          log(chalk.green(`### ${agent.name} ###`));
          log(run.instructions);
          log();
        },

        onAgentRunFinished({ result }) {
          log(chalk.gray("Done"));
        },

        onStepGenerationStarted({ messages }) {
          log(chalk.gray("Thinking…"));
          log(messages);
        },

        onStepGenerationFinished({ generatedText }) {
          log(chalk.cyanBright(generatedText));
          log();
        },

        onStepExecutionStarted({ step }) {
          if (step instanceof ToolStep) {
            log(chalk.gray(`Executing ${step.type}…`));
            return;
          }
        },

        onStepExecutionFinished({ step, result }) {
          if (step instanceof ToolStep) {
            const resultType = result.type;

            switch (resultType) {
              case "succeeded": {
                log(chalk.green(result.summary));
                log();
                break;
              }

              case "aborted": {
                log(chalk.yellow("Aborted"));
                log();
                break;
              }

              case "failed": {
                log(chalk.red(`ERROR: ${result.error}`));
                log();
                break;
              }

              default: {
                const _exhaustiveCheck: never = resultType;
                throw new Error(`Unhandled result type: ${resultType}`);
              }
            }
            return;
          }
        },
      },
    })
    .then(() => {})
    .catch((error) => {
      console.error("Error running instructions:", error);
    });
};
