import chalk from "chalk";
import { ToolStep } from "../action/tool/ToolStep";
import { AgentRunObserver } from "./AgentRunObserver";
import { AgentRun } from "./AgentRun";
import { Step, StepResult } from "../step";
import { ResultFormatterRegistry } from "../action/ResultFormatterRegistry";
import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";

const log = console.log;

export class ConsoleAgentRunObserver implements AgentRunObserver {
  private readonly resultFormatters: ResultFormatterRegistry;

  constructor({
    resultFormatters = new ResultFormatterRegistry(),
  }: {
    resultFormatters?: ResultFormatterRegistry;
  } = {}) {
    this.resultFormatters = resultFormatters;
  }

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
          const formatter = this.resultFormatters.getFormatter(step.type);

          if (formatter == null) {
            log(chalk.green(result.summary));
          } else {
            log(
              chalk.green(
                formatter.formatResult({
                  result: result as any, // TODO type safety
                })
              )
            );
          }

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
