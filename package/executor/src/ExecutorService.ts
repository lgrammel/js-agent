import Fastify from "fastify";
import hyperid from "hyperid";
import pino from "pino";
import zod from "zod";
import { commandPluginFactory } from "./commandPlugin";
import { gracefullyShutdownOnSigTermAndSigInt } from "./gracefullyShutdownOnSigTermAndSigInt";

const environmentSchema = zod.object({
  WORKSPACE: zod.string(),
  HOST: zod.string(),
  PORT: zod.string(),
});

const environment = environmentSchema.parse(process.env);

(async () => {
  const logger = pino({
    level: "debug",
    messageKey: "message",
  });

  const server = Fastify({
    logger,
    genReqId: hyperid(),
    requestIdLogLabel: "requestId",
  });

  server.register(commandPluginFactory(environment.WORKSPACE));

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
})();
