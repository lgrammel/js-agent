import { FastifyInstance } from "fastify";
import { commandSchema } from "../Command";
import { readFileContent } from "./readFileContent";

import { editFileContent } from "./editFileContent";
import { runCommand } from "./runCommand";

export function commandPluginFactory(workspaceFolder: string) {
  return async function commandPlugin(fastify: FastifyInstance) {
    fastify.post("/command", {
      async handler(request, reply) {
        try {
          const command = commandSchema.parse(request.body);
          const commandType = command.type;

          switch (commandType) {
            case "read-file":
              return await readFileContent(workspaceFolder, command.filepath);
            case "edit-file":
              return await editFileContent(
                workspaceFolder,
                command.filepath,
                command.content
              );
            case "run-command":
              return await runCommand(command.command);
            default:
              const _exhaustiveCheck: never = commandType;
              throw new Error(`Invalid command type: ${_exhaustiveCheck}`);
          }
        } catch (error: any) {
          reply.status(500).send({
            message: "An error occurred while processing the command.",
            error: error.message,
          });
        }
      },
    });
  };
}
