import { ToolAction } from "./ToolAction";

export class ToolRegistry {
  private readonly tools: Map<string, ToolAction<any, any>> = new Map();

  constructor({ tools }: { tools: ToolAction<any, any>[] }) {
    for (const tool of tools) {
      this.register(tool);
    }
  }

  register(tool: ToolAction<any, any>) {
    if (this.tools.has(tool.type)) {
      throw new Error(
        `A tool with the type '${tool.type}' has already been registered.`
      );
    }

    this.tools.set(tool.type, tool);
  }

  get toolTypes() {
    return Array.from(this.tools.keys());
  }

  getTool(type: string) {
    const tool = this.tools.get(type);

    if (!tool) {
      throw new Error(
        `No tool with the type '${type}' has been registered. Available tools: ${this.toolTypes.join(
          ", "
        )}`
      );
    }

    return tool;
  }
}
