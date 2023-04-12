import { AgentRun } from "../agent/AgentRun";
import { Step } from "./Step";

export type StepFactory = (run: AgentRun) => PromiseLike<Step>;
