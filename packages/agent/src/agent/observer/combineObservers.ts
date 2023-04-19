import { RunObserver } from "./RunObserver";

export const combineObservers = (...observers: RunObserver[]): RunObserver => ({
  onRunStarted: ({ run }) => {
    observers.forEach((observer) => observer.onRunStarted?.({ run }));
  },

  onRunFinished: ({ run, result }) => {
    observers.forEach((observer) => observer.onRunFinished?.({ run, result }));
  },

  onStepGenerationStarted: ({ run }) => {
    observers.forEach((observer) =>
      observer.onStepGenerationStarted?.({ run })
    );
  },

  onStepGenerationFinished: ({ run, generatedText, step }) => {
    observers.forEach((observer) =>
      observer.onStepGenerationFinished?.({ run, generatedText, step })
    );
  },

  onLoopIterationStarted: ({ run, loop }) => {
    observers.forEach((observer) =>
      observer.onLoopIterationStarted?.({ run, loop })
    );
  },

  onLoopIterationFinished: ({ run, loop }) => {
    observers.forEach((observer) =>
      observer.onLoopIterationFinished?.({ run, loop })
    );
  },

  onStepExecutionStarted: ({ run, step }) => {
    observers.forEach((observer) =>
      observer.onStepExecutionStarted?.({ run, step })
    );
  },

  onStepExecutionFinished: ({ run, step, result }) => {
    observers.forEach((observer) =>
      observer.onStepExecutionFinished?.({ run, step, result })
    );
  },
});
