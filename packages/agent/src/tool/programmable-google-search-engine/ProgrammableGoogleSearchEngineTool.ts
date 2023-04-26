import axios from "axios";
import zod from "zod";
import { FormatResultFunction } from "../../action/FormatResultFunction";
import { ExecuteBasicToolFunction } from "../../action/ExecuteBasicToolFunction";
import { BasicToolAction } from "../../action";

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

export const programmableGoogleSearchEngineAction = ({
  id = "search",
  description = "Search programmable Google search engine.",
  inputExample = {
    query: "{search query}",
  },
  execute,
  formatResult = ({ summary, output: { results } }) =>
    `## ${summary}\n${results
      .map(
        (result) => `### ${result.title}\n${result.link}\n${result.snippet}\n`
      )
      .join("\n")}`,
}: {
  id?: string;
  description?: string;
  inputExample?: ProgrammableGoogleSearchEngineInput;
  execute: ExecuteBasicToolFunction<
    ProgrammableGoogleSearchEngineInput,
    ProgrammableGoogleSearchEngineOutput
  >;
  formatResult?: FormatResultFunction<
    ProgrammableGoogleSearchEngineInput,
    ProgrammableGoogleSearchEngineOutput
  >;
}): BasicToolAction<
  ProgrammableGoogleSearchEngineInput,
  ProgrammableGoogleSearchEngineOutput
> => ({
  type: "basic-tool",
  id,
  description,
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
  inputExample,
  execute,
  formatResult,
});

export const executeProgrammableGoogleSearchEngineAction =
  ({
    key,
    cx,
    maxResults = 5,
  }: {
    key: string;
    cx: string;
    maxResults?: number;
  }): ExecuteBasicToolFunction<
    ProgrammableGoogleSearchEngineInput,
    ProgrammableGoogleSearchEngineOutput
  > =>
  async ({ input: { query } }) => {
    const result = await axios.get(
      `https://www.googleapis.com/customsearch/v1/siterestrict?key=${key}&cx=${cx}&q=${query}`
    );

    const items = result.data.items.slice(0, maxResults);

    return {
      summary: `Found ${items.length} search results.`,
      output: {
        results: items.map((item: any) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
        })),
      },
    };
  };
