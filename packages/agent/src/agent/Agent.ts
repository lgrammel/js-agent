import zod from "zod";
import { StepFactory } from "../step/StepFactory";
import { RunController } from "./controller/RunController";
import { LoadEnvironmentKeyFunction } from "./env/LoadEnvironmentKeyFunction";

export type Agent<
  ENVIRONMENT extends Record<string, string>,
  INPUT,
  RUN_PROPERTIES extends INPUT
> = {
  environment: Record<keyof ENVIRONMENT, LoadEnvironmentKeyFunction>;
  inputSchema: zod.ZodSchema<INPUT>;
  init: (options: {
    input: INPUT;
    environment: ENVIRONMENT;
  }) => Promise<RUN_PROPERTIES>;
  execute: (options: {
    environment: ENVIRONMENT;
  }) => Promise<StepFactory<RUN_PROPERTIES>>;
  controller?: RunController<RUN_PROPERTIES>;
};
