import { ToolAction } from "../ToolAction";

export class ToolRegistry<RUN_PROPERTIES> {
  private readonly tools: Map<string, ToolAction<any, any, RUN_PROPERTIES>> =
    new Map();

  constructor({ tools }: { tools: ToolAction<any, any, RUN_PROPERTIES>[] }) {
    for (const tool of tools) {
      this.register(tool);
    }
  }

  register(tool: ToolAction<any, any, RUN_PROPERTIES>) {
    if (this.tools.has(tool.id)) {
      throw new Error(
        `A tool with the id '${tool.id}' has already been registered.`
      );
    }

    this.tools.set(tool.id, tool);
  }

  get toolIds() {
    return Array.from(this.tools.keys());
  }

  getTool(id: string) {
    const tool = this.tools.get(id);

    if (!tool) {
      throw new Error(
        `No tool '${id}' found. Available tools: ${this.toolIds.join(", ")}`
      );
    }

    return tool;
  }
}
