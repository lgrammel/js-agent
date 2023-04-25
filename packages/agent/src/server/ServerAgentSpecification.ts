import zod from "zod";
import { StepFactory } from "../step/StepFactory";
import { RunController } from "../agent/controller/RunController";
import { LoadEnvironmentKeyFunction } from "../agent/env/LoadEnvironmentKeyFunction";
import { RunObserver } from "../agent/observer";

export type DataProvider<RUN_STATE, DATA> = RunObserver<RUN_STATE> & {
  getData(): Promise<DATA>;
};

export type ServerAgentSpecification<
  ENVIRONMENT extends Record<string, string>,
  INPUT,
  RUN_STATE extends INPUT,
  DATA
> = {
  environment: Record<keyof ENVIRONMENT, LoadEnvironmentKeyFunction>;
  inputSchema: zod.ZodSchema<INPUT>;
  init: (options: {
    input: INPUT;
    environment: ENVIRONMENT;
  }) => Promise<RUN_STATE>;
  execute: (options: {
    environment: ENVIRONMENT;
  }) => Promise<StepFactory<RUN_STATE>>;
  controller?: RunController<RUN_STATE>;
  createDataProvider: () => DataProvider<RUN_STATE, DATA>;
};
