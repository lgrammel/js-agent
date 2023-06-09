import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import zod from "zod";
import { ServerAgent } from "./ServerAgent";
import { ServerAgentSpecification } from "./ServerAgentSpecification";

export const AgentPlugin = <
  ENVIRONMENT extends Record<string, string>,
  INPUT,
  RUN_STATE extends INPUT,
  DATA
>({
  name,
  specification,
}: {
  name: string;
  specification: ServerAgentSpecification<ENVIRONMENT, INPUT, RUN_STATE, DATA>;
}) =>
  async function plugin(server: FastifyInstance) {
    const serverAgent = await ServerAgent.create({
      specification,
    });

    const typedServer = server.withTypeProvider<ZodTypeProvider>();

    // create agent run (POST /agent/:agent)
    typedServer.route({
      method: "POST",
      url: `/agent/${name}`,
      schema: {
        body: specification.inputSchema,
      },
      async handler(request, reply) {
        const runId = await serverAgent.createRun({
          input: request.body as INPUT,
        });

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
        const runId = request.params.runId;
        serverAgent.startRunWithoutWaiting({ runId });
        reply.code(201).send({ runId });
      },
    });

    // cancel agent run (POST /agent/:agent/run/:runId/cancel)
    typedServer.route({
      method: "POST",
      url: `/agent/${name}/run/:runId/cancel`,
      schema: {
        params: zod.object({
          runId: zod.string(),
        }),
        body: zod.object({
          reason: zod.string().optional(),
        }),
      },
      async handler(request, reply) {
        serverAgent.cancelRun({
          runId: request.params.runId,
          reason: request.body.reason,
        });

        reply.code(201).send({ runId: request.params.runId });
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
        const runId = request.params.runId;
        const state = await serverAgent.getRunState({ runId });

        const accept = request.accepts();
        switch (accept.type(["json", "html"])) {
          case "json": {
            reply.header("Content-Type", "application/json");
            reply.send({ state });
            break;
          }
          case "html": {
            reply.header("Content-Type", "text/html");
            reply.send(`
              <html>
                <head>
                  <title>Run ${runId}</title>
                </head>
                <body>
                  <pre>${JSON.stringify(state, null, 2)}</pre>
                </body>
              </html>
            `);
            break;
          }
          default: {
            reply.code(406).send({ error: "Not Acceptable" });
            break;
          }
        }
      },
    });
  };
