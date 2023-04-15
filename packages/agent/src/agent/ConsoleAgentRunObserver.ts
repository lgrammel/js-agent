import chalk from "chalk";
import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { Step } from "../step";
import { ToolStep } from "../tool/ToolStep";
import { AgentRun } from "./AgentRun";
import { AgentRunObserver } from "./AgentRunObserver";

const log = console.log;

export class ConsoleAgentRunObserver implements AgentRunObserver {
  onAgentRunStarted({ run }: { run: AgentRun }) {
    log(chalk.green(`### ${run.agent.name} ###`));
    log(run.objective);
    log();
  }

  onAgentRunFinished() {
    log(chalk.gray("Done"));
  }

  onStepGenerationStarted({
    messages,
  }: {
    messages: Array<OpenAIChatMessage>;
  }) {
    log(chalk.gray("Thinking…"));
  }

  onStepGenerationFinished({ generatedText }: { generatedText: string }) {
    log(chalk.cyanBright(generatedText));
    log();
  }

  onStepExecutionStarted({ step }: { step: Step }) {
    if (step instanceof ToolStep) {
      log(chalk.gray(`Executing ${step.type}…`));
      return;
    }
  }

  onStepExecutionFinished({ step }: { step: Step }) {
    if (step instanceof ToolStep) {
      const result = step.state;
      const resultType = result.type;

      switch (resultType) {
        case "succeeded": {
          log(chalk.green(step.action.formatResult(result as any)));
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

        case "pending":
        case "running": {
          // ignored
          break;
        }

        default: {
          const _exhaustiveCheck: never = resultType;
          throw new Error(`Unhandled result type: ${resultType}`);
        }
      }
      return;
    }
  }
}
