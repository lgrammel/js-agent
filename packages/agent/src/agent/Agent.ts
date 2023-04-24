import zod from "zod";
import { StepFactory } from "../step/StepFactory";
import { RunController } from "./controller/RunController";
import { LoadEnvironmentKeyFunction } from "./env/LoadEnvironmentKeyFunction";

export type Agent<
  ENVIRONMENT extends Record<string, string>,
  INPUT,
  RUN_STATE extends INPUT
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
};
