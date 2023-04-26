import zod from "zod";
import { ReflectiveToolAction } from "../../action/Action";
import { FormatResultFunction } from "../../action/FormatResultFunction";

export type UpdateRunStringPropertyInput = {
  content: string;
};

export type UpdateRunStringPropertyOutput = {
  content: string;
};

export const updateRunStringProperty = <
  KEY extends string,
  RUN_STATE extends {
    [key in KEY]: string;
  }
>({
  id = "update-run-string-property",
  description = "Update a stored string value.",
  inputExample = {
    content: "{new content}",
  },
  formatResult = ({ summary, output: { content } }) =>
    `## ${summary}\n### New content\n${content}`,
  property,
}: {
  id?: string;
  description?: string;
  inputExample?: UpdateRunStringPropertyInput;
  formatResult?: FormatResultFunction<
    UpdateRunStringPropertyInput,
    UpdateRunStringPropertyOutput
  >;
  property: KEY;
}): ReflectiveToolAction<
  UpdateRunStringPropertyInput,
  UpdateRunStringPropertyOutput,
  RUN_STATE
> => ({
  type: "reflective-tool",
  id,
  description,
  inputSchema: zod.object({
    content: zod.string(),
  }),
  outputSchema: zod.object({
    content: zod.string(),
  }),
  inputExample,
  formatResult,
  execute: async ({ input: { content }, run }) => {
    // @ts-expect-error TODO investigate constraint issue
    run.state[property] = content;

    return {
      output: {
        content,
      },
      summary: `Updated ${property}.`,
    };
  },
});
