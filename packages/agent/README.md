# GPTAgent.js: Automatic AI Agents with TS/JS

GPTAgent.js is a composable and extensible framework for creating AI agents with TypeScript/JavaScript.

Creating AI agents requires considerable experimentation to achieve good results.
GPTAgent.js makes the agent configuration explicit, so you can easily understand and adjust what the agent.

## Examples

**[BabyAGI](https://github.com/lgrammel/gptagent.js/tree/main/examples/babyagi)**:
A TypeScript / GPTAgent.js implementation of [BabyAGI](https://github.com/yoheinakajima/babyagi) by [@yoheinakajima](https://twitter.com/yoheinakajima).

**[JavaScript/TypeScript developer](https://github.com/lgrammel/gptagent.js/tree/main/examples/javascript-developer)**:
An automated developer agent that works in a docker container.
It can read files, write files and execute commands.
You can use it to document code, write tests, update tests and features, etc.

**[Wikipedia Question-Answering](https://github.com/lgrammel/gptagent.js/tree/main/examples/wikipedia-qa)**:
An agent that has access to a wikipedia search engine and can read wikipedia articles. You can use it to answer questions about wikipedia content.

## Usage

```sh
npm install @gptagent/agent
```

See examples for details on how to implement and run an agent.
See examples for details on how to implement and run an agent.

**GPTAgent.js is currently in its initial experimental phase. Prior to reaching version 0.1, there may breaking changes in each release.**

## Features

- **agents and agent runs**
- **dynamic loops**
- **tools**: read file, write file, run command, use programmable search engine, summarize website according to topic
- **agent/executor separation (optional)**: Run the executor in a safe environment (e.g. Docker container) where it can use the command line, install libraries, etc.

## Design Principles

- **typed**: Provide as much typing as possible to support discovery and ensure safety.
- **use functional programming for object assembly**: All objects that are immutable are assembled using functional programming. Object-orientation is only used for objects that have a changeable state (e.g. `Step` and `AgentRun`).
- **build for production**: GPTAgent.js will have first-class support for logging, associating LLM calls and cost tracking with agent runs, etc.

## GPT-4 vs GPT-3.5-turbo

For agents, it is recommended to use GPT-4. GPT-3.5-Turbo has trouble following instructions, accurately extracting information from text, and tends to hallucinate answers. However, GPT-4 can be expensive and is not fully available yet.

## Example Agent Definition

```ts
import * as $ from "@gptagent/agent";
import { runCLIAgent } from "@gptagent/agent";

const textGenerator = new $.ai.openai.OpenAiChatTextGenerator({
  apiKey: process.env.OPENAI_API_KEY ?? "",
  model: "gpt-3.5-turbo",
});

const searchWikipediaAction = $.tool.programmableGoogleSearchEngineAction({
  id: "search-wikipedia",
  description: "Search wikipedia using a search term. Returns a list of pages.",
  execute: $.tool.executeProgrammableGoogleSearchEngineAction({
    key: process.env.WIKIPEDIA_SEARCH_KEY ?? "",
    cx: process.env.WIKIPEDIA_SEARCH_CX ?? "",
  }),
});

const readWikipediaArticleAction = $.tool.summarizeWebpage({
  id: "read-wikipedia-article",
  description:
    "Read a wikipedia article and summarize it considering the query.",
  inputExample: {
    url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
    topic: "{query that you are answering}",
  },
  execute: $.tool.executeSummarizeWebpage({
    webpageTextExtractor:
      new $.component.webpageTextExtractor.BasicWebpageTextExtractor(),
    summarizer: new $.component.textSummarizer.RecursiveSplitSummarizer({
      splitter: new $.component.splitter.RecursiveCharacterSplitter({
        // note: maxCharactersPerChunk can be increased to 4096 * 4 when you use gpt-4
        maxCharactersPerChunk: 2048 * 4,
      }),
      summarizer: new $.component.textSummarizer.ChatTextSummarizer({
        chatTextGenerator: textGenerator,
      }),
    }),
  }),
});

runCLIAgent({
  agent: new $.agent.Agent({
    name: "Wikipedia QA",
    execute: $.step.createGenerateNextStepLoop({
      prompt: new $.prompt.CompositePrompt(
        new $.prompt.FixedSectionsPrompt({
          sections: [
            {
              title: "Role",
              // Note: "You speak perfect JSON" helps getting gpt-3.5-turbo to provide structured json at the end
              content: `You are an knowledge worker that answers questions using Wikipedia content.
You speak perfect JSON.`,
            },
            {
              title: "Constraints",
              content: `Make sure all facts for your answer are from Wikipedia articles that you have read.`,
            },
          ],
        }),
        new $.prompt.TaskSectionPrompt(),
        new $.prompt.AvailableActionsSectionPrompt(),
        new $.prompt.RecentStepsPrompt({ maxSteps: 6 })
      ),
      actionRegistry: new $.action.ActionRegistry({
        actions: [searchWikipediaAction, readWikipediaArticleAction],
        format: new $.action.format.JsonActionFormat(),
      }),
      textGenerator,
    }),
  }),
  observer: new $.agent.ConsoleAgentRunObserver(),
});
```

## Example Output

![wikipedia-qa](https://github.com/lgrammel/gptagent.js/raw/main/examples/wikipedia-qa/screenshot/wikipedia-qa-001.png)

## Requirements

- node 18
- pnpm
