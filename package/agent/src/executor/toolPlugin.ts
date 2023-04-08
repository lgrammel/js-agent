import { FastifyInstance } from "fastify";
import { ToolRegistry } from "../action/tool";

export function createToolPlugin({
  toolRegistry,
  workspacePath,
}: {
  toolRegistry: ToolRegistry;
  workspacePath: string;
}) {
  return async function toolPlugin(fastify: FastifyInstance) {
    fastify.post<{ Params: { toolType: string } }>("/tool/:toolType", {
      async handler(request, reply) {
        try {
          const toolType = request.params.toolType;
          const tool = toolRegistry.getTool(toolType);

          const input = tool.inputSchema.parse(request.body);
          const output = await tool.executor.execute({
            input,
            action: tool,
            context: {
              workspacePath,
              generateText: async () => {
                throw new Error("Not implemented");
              },
            },
          });

          const textOutput = JSON.stringify(output);

          reply.status(200).send(textOutput);
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
