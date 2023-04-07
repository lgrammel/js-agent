import zod from "zod";
import { ActionParameters } from "./ActionParameters";

export interface Action<
  INPUT extends ActionParameters,
  OUTPUT extends Record<string, string | undefined>
> {
  readonly type: string;
  readonly description: string;

  readonly inputSchema: zod.Schema<INPUT>;
  readonly inputExample?: INPUT;

  readonly outputSchema: zod.Schema<OUTPUT>;
}
