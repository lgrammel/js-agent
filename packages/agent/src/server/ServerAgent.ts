import hyperid from "hyperid";
import { Run } from "../agent/Run";
import { noLimit } from "../agent/controller/noLimit";
import { loadEnvironment } from "../agent/env/loadEnvironment";
import { StepFactory } from "../step/StepFactory";
import { ServerAgentSpecification } from "./ServerAgentSpecification";

export class ServerAgent<
  ENVIRONMENT extends Record<string, string>,
  INPUT,
  RUN_STATE extends INPUT
> {
  static async create<
    ENVIRONMENT extends Record<string, string>,
    INPUT,
    RUN_STATE extends INPUT
  >({
    specification,
  }: {
    specification: ServerAgentSpecification<ENVIRONMENT, INPUT, RUN_STATE>;
  }) {
    const environment = await loadEnvironment<ENVIRONMENT>(
      specification.environment
    );
    const createRootStep = await specification.execute({ environment });

    return new ServerAgent({
      specification,
      environment,
      createRootStep,
    });
  }

  private readonly environment: ENVIRONMENT;

  private readonly createRootStep: StepFactory<RUN_STATE>;

  private readonly runs = new Map<string, Run<RUN_STATE>>();

  private readonly nextId = hyperid({ urlSafe: true });

  private readonly specification: ServerAgentSpecification<
    ENVIRONMENT,
    INPUT,
    RUN_STATE
  >;

  private constructor({
    specification,
    createRootStep,
    environment,
  }: {
    specification: ServerAgentSpecification<ENVIRONMENT, INPUT, RUN_STATE>;
    createRootStep: StepFactory<RUN_STATE>;
    environment: ENVIRONMENT;
  }) {
    this.specification = specification;
    this.environment = environment;
    this.createRootStep = createRootStep;
  }

  async createRun({ input }: { input: INPUT }) {
    const runId = this.nextId();

    const run = new Run<RUN_STATE>({
      controller: this.specification.controller ?? noLimit(),
      initialState: await this.specification.init({
        environment: this.environment,
        input,
      }),
    });

    const rootStep = await this.createRootStep(run);
    run.root = rootStep;

    this.runs.set(runId, run);

    return runId;
  }

  startRunWithoutWaiting({ runId }: { runId: string }) {
    const run = this.runs.get(runId);

    if (run == null) {
      throw new Error(`Run ${runId} not found`);
    }

    // run asynchronously:
    setTimeout(async () => {
      run.onStart();
      const result = await run.root!.execute();
      run.onFinish({ result });
    }, 0);
  }

  getRunState({ runId }: { runId: string }) {
    const run = this.runs.get(runId);

    if (run == null) {
      throw new Error(`Run ${runId} not found`);
    }

    return run.root!.state;
  }
}
