import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import hyperid from "hyperid";
import zod from "zod";
import { Agent } from "../agent/Agent";
import { Run } from "../agent/Run";
import { noLimit } from "../agent/controller/noLimit";
import { loadEnvironment } from "../agent/env/loadEnvironment";

export const AgentPlugin = <
  ENVIRONMENT extends Record<string, string>,
  INPUT,
  RUN_PROPERTIES extends INPUT
>({
  name,
  agent,
}: {
  name: string;
  agent: Agent<ENVIRONMENT, INPUT, RUN_PROPERTIES>;
}) =>
  async function plugin(server: FastifyInstance) {
    const typedServer = server.withTypeProvider<ZodTypeProvider>();
    const nextId = hyperid({ urlSafe: true });
    const environment = await loadEnvironment<ENVIRONMENT>(agent.environment);
    const createRootStep = await agent.execute({ environment });

    const runs = new Map<string, Run<RUN_PROPERTIES>>();

    // create agent run (POST /agent/:agent)
    typedServer.route({
      method: "POST",
      url: `/agent/${name}`,
      schema: {
        body: agent.inputSchema,
      },
      async handler(request, reply) {
        const runId = nextId();

        const run = new Run<RUN_PROPERTIES>({
          controller: agent.controller ?? noLimit(),
          properties: await agent.init({
            environment,
            input: request.body as INPUT,
          }),
        });

        const rootStep = await createRootStep(run);
        run.root = rootStep;

        runs.set(runId, run);

        reply.code(201).send({ runId });
      },
    });

    // start agent run (POST /agent/:agent/run/:runId/start)
    typedServer.route({
      method: "POST",
      url: `/agent/${name}/run/:runId/start`,
      schema: {
        params: zod.object({
          runId: zod.string(),
        }),
      },
      async handler(request, reply) {
        const { runId } = request.params;
        const run = runs.get(runId);

        if (!run) {
          reply.code(404).send({ error: "Run not found" });
          return;
        }

        // run asynchronously:
        setTimeout(async () => {
          run.onStart();
          const result = await run.root!.execute();
          run.onFinish({ result });
        }, 0);

        reply.code(201).send({ runId });
      },
    });

    // get agent run status:
    typedServer.route({
      method: "GET",
      url: `/agent/${name}/run/:runId`,
      schema: {
        params: zod.object({
          runId: zod.string(),
        }),
      },
      async handler(request, reply) {
        const run = runs.get(request.params.runId);

        if (!run) {
          reply.code(404).send({ error: "Run not found" });
          return;
        }

        const state = run.root!.state;

        reply.send({ state });
      },
      // async wsHandler(connection, request) {
      //   const run = runs.get(request.params.runId);

      //   if (!run) {
      //     connection.socket.write(JSON.stringify({ error: "Run not found" }));
      //     connection.socket.end();
      //     return;
      //   }

      //   const state = run.root!.state;

      //   connection.socket.write(JSON.stringify({ state }));

      //   run.onStateChange((state) => {
      //     connection.socket.write(JSON.stringify({ state }));
      //   });
      // },
    });
  };
