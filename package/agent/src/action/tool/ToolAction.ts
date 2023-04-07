import zod from "zod";
import { Action } from "../Action.js";
import { ToolExecutor } from "./ToolExecutor.js";

export class ToolAction<
  INPUT extends Record<string, string | undefined>,
  OUTPUT extends Record<string, string | undefined>
> implements Action<INPUT, OUTPUT>
{
  readonly type: string;
  readonly description: string;

  readonly inputSchema: zod.Schema<INPUT>;
  readonly inputExample: INPUT;

  readonly outputSchema: zod.Schema<OUTPUT>;

  readonly executor: ToolExecutor<INPUT, OUTPUT>;

  constructor({
    type,
    description,
    inputSchema,
    inputExample,
    outputSchema,
    executor,
  }: {
    type: string;
    description: string;
    inputSchema: zod.Schema<INPUT>;
    inputExample: INPUT;
    outputSchema: zod.Schema<OUTPUT>;
    executor: ToolExecutor<INPUT, OUTPUT>;
  }) {
    this.type = type;
    this.description = description;
    this.inputSchema = inputSchema;
    this.inputExample = inputExample;
    this.outputSchema = outputSchema;
    this.executor = executor;
  }
}
