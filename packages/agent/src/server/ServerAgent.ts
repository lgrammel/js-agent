import hyperid from "hyperid";
import { Run } from "../agent/Run";
import { noLimit } from "../agent/controller/noLimit";
import { loadEnvironment } from "../agent/env/loadEnvironment";
import { StepFactory } from "../step/StepFactory";
import {
  DataProvider,
  ServerAgentSpecification,
} from "./ServerAgentSpecification";
import { all, cancellable } from "../agent/controller";

const nextId = hyperid({ urlSafe: true });

export class ServerAgent<
  ENVIRONMENT extends Record<string, string>,
  INPUT,
  RUN_STATE extends INPUT,
  DATA
> {
  static async create<
    ENVIRONMENT extends Record<string, string>,
    INPUT,
    RUN_STATE extends INPUT,
    DATA
  >({
    specification,
  }: {
    specification: ServerAgentSpecification<
      ENVIRONMENT,
      INPUT,
      RUN_STATE,
      DATA
    >;
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

  private readonly runs = new Map<string, ManagedRun<INPUT, RUN_STATE, DATA>>();

  private readonly specification: ServerAgentSpecification<
    ENVIRONMENT,
    INPUT,
    RUN_STATE,
    DATA
  >;

  private constructor({
    specification,
    createRootStep,
    environment,
  }: {
    specification: ServerAgentSpecification<
      ENVIRONMENT,
      INPUT,
      RUN_STATE,
      DATA
    >;
    createRootStep: StepFactory<RUN_STATE>;
    environment: ENVIRONMENT;
  }) {
    this.specification = specification;
    this.environment = environment;
    this.createRootStep = createRootStep;
  }

  async createRun({ input }: { input: INPUT }) {
    const dataProvider = this.specification.createDataProvider();

    const cancelController = cancellable<RUN_STATE>();

    const run = new Run<RUN_STATE>({
      controller: all<RUN_STATE>(
        this.specification.controller ?? noLimit(),
        cancelController
      ),
      initialState: await this.specification.init({
        environment: this.environment,
        input,
      }),
      observer: dataProvider,
    });

    const rootStep = await this.createRootStep(run);
    run.root = rootStep;

    const managedRun = new ManagedRun({
      id: nextId(),
      input,
      run,
      dataProvider,
      cancelController,
    });

    this.runs.set(managedRun.id, managedRun);

    return managedRun.id;
  }

  startRunWithoutWaiting({ runId }: { runId: string }) {
    const run = this.runs.get(runId);

    if (run == null) {
      throw new Error(`Run ${runId} not found`);
    }

    // run asynchronously:
    setTimeout(async () => run.start(), 0);
  }

  cancelRun({ runId, reason }: { runId: string; reason: string }) {
    const run = this.runs.get(runId);

    if (run == null) {
      throw new Error(`Run ${runId} not found`);
    }

    run.cancel({ reason });
  }

  async getRunState({ runId }: { runId: string }) {
    const run = this.runs.get(runId);

    if (run == null) {
      throw new Error(`Run ${runId} not found`);
    }

    return run.getState();
  }
}

class ManagedRun<INPUT, RUN_STATE, DATA> {
  readonly id: string;
  readonly input: INPUT;
  readonly run: Run<RUN_STATE>;
  readonly dataProvider: DataProvider<RUN_STATE, DATA>;
  readonly cancelController: {
    cancel(options: { reason: string }): void;
  };

  constructor({
    id,
    input,
    run,
    dataProvider,
    cancelController,
  }: {
    id: string;
    input: INPUT;
    run: Run<RUN_STATE>;
    dataProvider: DataProvider<RUN_STATE, DATA>;
    cancelController: {
      cancel(options: { reason: string }): void;
    };
  }) {
    this.id = id;
    this.input = input;
    this.run = run;
    this.dataProvider = dataProvider;
    this.cancelController = cancelController;
  }

  async start() {
    this.run.onStart();
    const result = await this.run.root!.execute();
    this.run.onFinish({ result });
  }

  cancel({ reason }: { reason: string }) {
    this.cancelController.cancel({ reason });
  }

  async getState() {
    return {
      id: this.id,
      input: this.input,
      state: this.run.root!.state,
      data: await this.dataProvider.getData(),
    };
  }
}
