import zod from "zod";

export const commandSchema = zod.discriminatedUnion("type", [
  zod.object({
    type: zod.literal("read-file"),
    filepath: zod.string(),
  }),
  zod.object({
    type: zod.literal("edit-file"),
    filepath: zod.string(),
    content: zod.string(),
  }),
  zod.object({
    type: zod.literal("run-command"),
    command: zod.string(),
  }),
]);

export type Command = zod.infer<typeof commandSchema>;
