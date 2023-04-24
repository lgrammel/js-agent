import { ToolAction } from "../ToolAction";

export class ToolRegistry {
  private readonly tools: Map<string, ToolAction<any, any>> = new Map();

  constructor({ tools }: { tools: ToolAction<any, any>[] }) {
    for (const tool of tools) {
      this.register(tool);
    }
  }

  register(tool: ToolAction<any, any>) {
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
