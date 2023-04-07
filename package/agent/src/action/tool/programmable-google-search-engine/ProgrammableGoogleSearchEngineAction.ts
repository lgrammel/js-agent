import zod from "zod";
import { ToolAction } from "../ToolAction";
import { ToolExecutor } from "../ToolExecutor";

export type ProgrammableGoogleSearchEngineInput = {
  query: string;
};

export type ProgrammableGoogleSearchEngineOutput = {
  results: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
};

export class ProgrammableGoogleSearchEngineAction extends ToolAction<
  ProgrammableGoogleSearchEngineInput,
  ProgrammableGoogleSearchEngineOutput
> {
  constructor({
    type = "tool.programmable-google-search-engine",
    description = "Search programmable Google search engine.",
    inputExample = {
      query: "{search query}",
    },
    executor,
  }: {
    type?: string;
    description?: string;
    inputExample?: ProgrammableGoogleSearchEngineInput;
    executor: ToolExecutor<
      ProgrammableGoogleSearchEngineInput,
      ProgrammableGoogleSearchEngineOutput
    >;
  }) {
    super({
      type,
      description,
      inputExample,
      inputSchema: zod.object({
        query: zod.string(),
      }),
      outputSchema: zod.object({
        results: zod.array(
          zod.object({
            title: zod.string(),
            link: zod.string(),
            snippet: zod.string(),
          })
        ),
      }),
      executor,
    });
  }
}
