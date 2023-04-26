import chalk from "chalk";
import { Step, StepResult } from "../../step";
import { BasicToolStep } from "../../tool/BasicToolStep";
import { Run } from "../Run";
import { RunObserver } from "./RunObserver";

const log = console.log;

export const showRunInConsole = <RUN_STATE>({
  name,
}: {
  name: string;
}): RunObserver<RUN_STATE> => ({
  onRunStarted({ run }: { run: Run<RUN_STATE> }) {
    log(chalk.green(`### ${name} ###`));
    log(run.state);
    log();
  },

  onRunFinished({ result }: { result: StepResult }) {
    if (result.type === "cancelled") {
      log(chalk.gray(`Cancelled: ${result.reason}`));
      return;
    }

    log(chalk.gray("Done"));
  },

  onStepGenerationStarted() {
    log(chalk.gray("Thinking…"));
  },

  onStepGenerationFinished({ generatedText }: { generatedText: string }) {
    log(chalk.cyanBright(generatedText));
    log();
  },

  onStepExecutionStarted({ step }: { step: Step<RUN_STATE> }) {
    if (step instanceof BasicToolStep) {
      log(chalk.gray(`Executing ${step.type}…`));
      return;
    }
  },

  onStepExecutionFinished({ step }: { step: Step<RUN_STATE> }) {
    if (step instanceof BasicToolStep) {
      const result = step.state;
      const resultType = result.type;

      switch (resultType) {
        case "succeeded": {
          log(chalk.green(step.action.formatResult(result as any)));
          log();
          break;
        }

        case "cancelled": {
          log(chalk.yellow("Cancelled"));
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
  },
});
