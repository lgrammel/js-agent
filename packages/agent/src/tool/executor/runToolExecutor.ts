import Fastify from "fastify";
import hyperid from "hyperid";
import pino from "pino";
import zod from "zod";
import { gracefullyShutdownOnSigTermAndSigInt } from "../../util/gracefullyShutdownOnSigTermAndSigInt";
import { ToolRegistry } from "./ToolRegistry";
import { createToolPlugin } from "./toolPlugin";
import { BasicToolAction } from "../../action/Action";

export const runToolExecutor = async ({
  tools,
}: {
  tools: Array<BasicToolAction<any, any>>;
}) => {
  const environmentSchema = zod.object({
    WORKSPACE: zod.string(),
    HOST: zod.string(),
    PORT: zod.string(),
  });

  const environment = environmentSchema.parse(process.env);

  const logger = pino({
    level: "debug",
    messageKey: "message",
  });

  const server = Fastify({
    logger,
    genReqId: hyperid(),
    requestIdLogLabel: "requestId",
  });

  server.register(
    createToolPlugin({
      toolRegistry: new ToolRegistry({ tools }),
      logger,
    })
  );

  await server.listen({
    host: environment.HOST,
    port: parseInt(environment.PORT),
  });

  logger.info(`Executor service started.`);

  // catch uncaught exceptions (to prevent the process from crashing)
  process.on("uncaughtException", (error) => {
    logger.error(error, "Uncaught error.");
  });

  gracefullyShutdownOnSigTermAndSigInt({
    logger,
    async shutdown() {
      await server.close(); // wait for requests to be finished
    },
  });
};
