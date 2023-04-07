import zod from "zod";
import { ToolAction } from "../ToolAction";
import { ToolExecutor } from "../ToolExecutor";

export type CustomGoogleSearchEngineInput = {
  query: string;
};

export type CustomGoogleSearchEngineOutput = {
  results: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
};

export class CustomGoogleSearchEngineAction extends ToolAction<
  CustomGoogleSearchEngineInput,
  CustomGoogleSearchEngineOutput
> {
  constructor({
    type = "tool.google-custom-search-engine",
    description = "Search custom Google Search Engine.",
    inputExample = {
      query: "{search query}",
    },
    executor,
  }: {
    type?: string;
    description?: string;
    inputExample?: CustomGoogleSearchEngineInput;
    executor: ToolExecutor<
      CustomGoogleSearchEngineInput,
      CustomGoogleSearchEngineOutput
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
