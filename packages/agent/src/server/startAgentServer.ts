#!/usr/bin/env node

import accepts from "@fastify/accepts";
import websocket from "@fastify/websocket";
import { Command, Option } from "commander";
import dotenv from "dotenv";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import hyperid from "hyperid";
import fs from "node:fs";
import path from "node:path";
import pino from "pino";
import { gracefullyShutdownOnSigTermAndSigInt } from "../util/gracefullyShutdownOnSigTermAndSigInt";
import { AgentPlugin } from "./AgentPlugin";

dotenv.config();

const program = new Command();

program
  .description("JS Agent server")
  .addOption(
    new Option("-h, --host <string>", "host name")
      .env("JS_AGENT_HOST")
      .default("127.0.0.1")
  )
  .addOption(
    new Option("-p, --port <number>", "port number")
      .env("JS_AGENT_PORT")
      .default("30800")
      .argParser((value: string) => +value)
  )
  .addOption(
    new Option(
      "-f, --folder <string>",
      "folder with agent specifications in subdirectories"
    )
      .env("JS_AGENT_PATH")
      .makeOptionMandatory()
  )
  .parse(process.argv);

const programArguments: {
  host: string;
  port: number;
  folder: string;
} = program.opts();

const logger = pino({
  level: "info",
  messageKey: "message",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

const agentBaseFolder = path.join(process.cwd(), programArguments.folder);

if (!fs.existsSync(agentBaseFolder)) {
  logger.error(`Agent base folder ${agentBaseFolder} does not exist. Exiting.`);
  process.exit(1);
}

// catch uncaught exceptions (to prevent the process from crashing)
process.on("uncaughtException", (error) => {
  logger.error(error, "Uncaught error.");
});

(async () => {
  logger.info(`Starting JS Agent server.`);

  const server = Fastify({
    logger,

    // Generate custom request IDs. This is required to distinguish between
    // requests made on different pods in a Kubernetes cluster.
    genReqId: hyperid(),

    // Unified key for the request ID in the logs:
    requestIdLogLabel: "requestId",
  });

  await server.register(websocket);
  await server.register(accepts);

  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  gracefullyShutdownOnSigTermAndSigInt({
    logger,
    shutdown: async () => {
      await server.close(); // wait for requests to be finished
      logger.info("JS Agent server stopped.");
    },
  });

  // set up agents:
  const agentFolderNames = fs
    .readdirSync(agentBaseFolder, { withFileTypes: true })
    .filter((agentFolder) => agentFolder.isDirectory())
    .map((agentFolder) => agentFolder.name);

  for (const agentName of agentFolderNames) {
    const agentDefinitionPath = path.join(
      agentBaseFolder,
      agentName,
      "agent.js"
    );

    if (!fs.existsSync(agentDefinitionPath)) {
      logger.warn(
        `Agent definition file not found at ${agentDefinitionPath}. Skipping.`
      );
      continue;
    }

    server.register(
      AgentPlugin({
        name: agentName,
        agent: (await import(agentDefinitionPath)).default,
      })
    );
  }

  await server.listen({
    host: programArguments.host,
    port: programArguments.port,
  });

  logger.info(`JS Agent server started.`);
})().catch((error) => {
  logger.error(error);
});
