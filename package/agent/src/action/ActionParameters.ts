import zod from "zod";

export type ActionParameters = Record<string, string | undefined>;

export const actionParametersSchema = zod.record(
  zod.union([zod.string(), zod.undefined()])
);
