import $, { ActionRegistry, Agent, runAgent } from "@gptagent/agent";
import dotenv from "dotenv";

dotenv.config();

runAgent({
  agent: new Agent({
    name: "Wikipedia QA",
    role: `You are an knowledge worker that answers questions using Wikipedia content.`,
    constraints: `Make sure all facts for your answer are from Wikipedia articles that you have read.`,
    actionRegistry: new ActionRegistry({
      actions: [
        new $.action.tool.ProgrammableGoogleSearchEngineAction({
          type: "tool.search-wikipedia",
          description:
            "Search wikipedia using a search term. Returns a list of pages.",
          executor: new $.action.tool.ProgrammableGoogleSearchEngineExecutor({
            key: process.env.WIKIPEDIA_SEARCH_KEY,
            cx: process.env.WIKIPEDIA_SEARCH_CX,
          }),
        }),
        new $.action.tool.SummarizeWebpageAction({
          type: "tool.read-wikipedia-article",
          description:
            "Read a wikipedia article and summarize it considering the query.",
          inputExample: {
            url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
            topic: "{query that you are answering}",
          },
          executor: new $.action.tool.SummarizeWebpageExecutor(),
        }),
      ],
      format: new $.action.format.JsonActionFormat(),
    }),
  }),
});
