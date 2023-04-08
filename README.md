# GPTAgent.js: Automatic AI Agents with TS/JS

GPTAgent.js is a composable and extensible framework for creating AI agents with TypeScript/JavaScript.

Creating AI agents requires a lot of experimentation.
GPTAgent.js makes the agent configuration explicit, so you can easily understand and adjust what the agent is doing.

## Examples

- [JavaScript/TypeScript developer](example/javascript-developer)
- [Wikipedia Question-Answering](example/wikipedia-qa)

## Usage

```sh
npm install @gptagent/agent
```

See examples for details on how to implement and run an agent.

## Features

- **agent**: agent that can identify steps and take actions (based on a role and your instructions)
- **tools**: read file, write file, run command, use programmable search engine, summarize website according to topic
- **agent/executor separation (optional)**: Run the executor in a safe environment (e.g. Docker container) where it can use the command line, install libraries, etc.
- **cost tracking**

## Example Agent Definition

```js
import $, { ActionRegistry, Agent, runAgent } from "@gptagent/agent";
import dotenv from "dotenv";

dotenv.config();

const textGenerator = new $.ai.openai.Gpt4ChatTextGenerator({
  apiKey: process.env.OPENAI_API_KEY,
});

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
          executor: new $.action.tool.SummarizeWebpageExecutor({
            summarizer:
              new $.component.textSummarizer.SingleLevelSplitSummarizer({
                splitter: new $.component.splitter.RecursiveCharacterSplitter({
                  maxCharactersByChunk: 4096 * 4,
                }),
                summarizer: new $.component.textSummarizer.ChatTextSummarizer({
                  chatTextGenerator: textGenerator,
                }),
              }),
          }),
        }),
      ],
      format: new $.action.format.JsonActionFormat(),
    }),
    textGenerator,
  }),
});
```

## Requirements

- **GPT-4 access**
- node 18
- pnpm
