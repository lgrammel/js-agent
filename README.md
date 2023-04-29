# JS Agent: Build AI Agents & Apps with JS & TS

[![Twitter Follow](https://img.shields.io/twitter/follow/lgrammel?style=social)](https://twitter.com/intent/follow?screen_name=lgrammel)

JS Agent is a composable and extensible framework for creating AI agents with JavaScript and TypeScript.

While creating an agent prototype is easy, increasing its reliability and robustness is complex and requires considerable experimentation. JS Agent provides robust building blocks and tooling to help you develop rock-solid agents faster.

**⚠️ JS Agent is currently in its initial experimental phase. Before reaching version 0.1, there may be breaking changes in each release.**

## Documentation ([js-agent.ai](https://js-agent.ai))

- [Concepts](https://js-agent.ai/concepts)
- [Tutorial](https://js-agent.ai/tutorial/wikipedia-agent)
- [API docs](https://js-agent.ai/api/modules)

## Examples

### [Wikipedia Question-Answering](https://github.com/lgrammel/js-agent/tree/main/examples/wikipedia)

[Tutorial](https://js-agent.ai/docs/tutorial-wikipedia-agent/)

An agent that has access to a wikipedia search engine and can read wikipedia articles. You can use it to answer questions about wikipedia content.

Used features: `gpt-3.5-turbo`, custom tools (search wikipedia, read wikipedia article), generate next step loop, max steps run controller

### [JavaScript/TypeScript developer](https://github.com/lgrammel/js-agent/tree/main/examples/javascript-developer)

An automated developer agent that works in a docker container. It can read files, write files and execute commands. You can adjust it for your project and use it to document code, write tests, update tests and features, etc.

Used features: `gpt-4`, tool execution in Docker container, agent with fixed setup steps, multiple agent run properties, generate next step loop, tools (read file, write file, run, command, ask user), cost calculation after agent run

### [BabyAGI](https://github.com/lgrammel/js-agent/tree/main/examples/babyagi)

JS Agent implementation of [BabyAGI](https://github.com/yoheinakajima/babyagi).

Features used: HTTP Agent server, text completion model (`text-davinci-003`), customized console output, update tasks planning loop

### [PDF to Twitter Thread](https://github.com/lgrammel/js-agent/tree/main/examples/pdf-to-twitter-thread)

Takes a PDF and a topic and creates a Twitter thread with all content from the PDF that is relevant to the topic.

Features used: function composition (no agent), pdf loading, split-extract-rewrite

### [Split and Embed Text](https://github.com/lgrammel/js-agent/tree/main/examples/split-and-embed-text)

Splits a text into chunks and generates embeddings.

Features used: direct function calls (no agent), split text (gpt3-tokenizer), generate embeddings

## Features

- Agent definition and execution
  - Configurable agent run properties that can be accessed by prompts
  - Observe agent runs (to support console output, UIs, server runs, webapps, etc.)
  - Record all LLM calls of an agent run
  - Calculate the cost of LLM calls and agent runs
  - Stop agent runs when certain criteria are met, e.g. to limit the number of steps
  - Use several different LLM models in one agent
- Agent HTTP Server
  - Agent runs can be started, stopped, and observed via HTTP API
  - Can host multiple agents
- Supported LLM models and APIs
  - OpenAI text completion models (`text-davinci-003` etc.)
  - OpenAI chat completion models (`gpt-4`, `gpt-3.5-turbo`)
  - OpenAI embedding model (`text-embedding-ada-002`)
- Actions and Tools
  - Read and write file
  - Run CLI command
  - Use programmable search engine
  - Extract information on topic from webpage
  - Ask user for input
  - Write to string property
  - Call sub-agent (loop)
  - Optional agent/executor separation (e.g. run the executor in a sandbox environment such as a Docker container)
- Agent lops
  - BabyAGI-style update tasks planning loop
  - Generate next step loop
- Prompt templates for chat and text prompts
  - Built-in templates for quick start
    - Available actions prompt; extract information prompts; recent steps prompt, rewrite text prompt
  - Utility functions to combine and convert prompts
- Text functions
  - Extract information (extract & rewrite; extract recursively)
  - Splitters: split text into chunks
    - By character
    - By token (using [tiktoken](https://www.npmjs.com/package/@dqbd/tiktoken) tokenizer)
  - Helpers: load, generate
- Data sources
  - Webpage as HTML text
  - File as ArrayBuffer
- Data converters
  - htmlToText
  - pdfToText
- General utils
  - LLM call retry with exponential backoff

## Design Principles

- **typed**: Provide as much typing as possible to support discovery and ensure safety.
- **direct function calls**: All utility functions can be called directly without an agent or creating composite functions.
- **composable**: The individual pieces should have a good separation of concerns and be easy to combine.
- **extensible**: It should be easy for users to add their own tools, providers, actions, agent steps, etc.
- **use functional programming for composition**: All objects that are immutable are assembled using functional programming. Object-orientation is only used for objects that have a changeable state (e.g. `Step` and `AgentRun`).
- **support progressive refinement of agent specifications**: Agent specifications should be easy to write and every building block should provide good defaults. At the same time, it should be possible to easily override the defaults with specific settings, prompts, etc.
- **build for production**: JS Agent will have first-class support for logging, associating LLM calls and cost tracking with agent runs, etc.

## Quick Install

```sh
npm install js-agent
```

See the [examples](https://github.com/lgrammel/js-agent/tree/main/examples/) and [documentation](https://js-agent.ai/docs/intro) to learn how to create an agent.

## Example Agent

```ts
import * as $ from "js-agent";

export async function runWikipediaAgent({
  wikipediaSearchKey,
  wikipediaSearchCx,
  openAiApiKey,
  task,
}: {
  openAiApiKey: string;
  wikipediaSearchKey: string;
  wikipediaSearchCx: string;
  task: string;
}) {
  const searchWikipediaAction = $.tool.programmableGoogleSearchEngineAction({
    id: "search-wikipedia",
    description:
      "Search wikipedia using a search term. Returns a list of pages.",
    execute: $.tool.executeProgrammableGoogleSearchEngineAction({
      key: wikipediaSearchKey,
      cx: wikipediaSearchCx,
    }),
  });

  const readWikipediaArticleAction = $.tool.extractInformationFromWebpage({
    id: "read-wikipedia-article",
    description:
      "Read a wikipedia article and summarize it considering the query.",
    inputExample: {
      url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
      topic: "{query that you are answering}",
    },
    execute: $.tool.executeExtractInformationFromWebpage({
      extract: $.text.extractRecursively.asExtractFunction({
        split: $.text.splitRecursivelyAtToken.asSplitFunction({
          tokenizer: $.provider.openai.tokenizerForModel({
            model: "gpt-3.5-turbo",
          }),
          maxChunkSize: 2048, // needs to fit into a gpt-3.5-turbo prompt and leave room for the answer
        }),
        extract: $.text.generateText.asFunction({
          prompt: $.prompt.extractChatPrompt(),
          model: $.provider.openai.chatModel({
            apiKey: openAiApiKey,
            model: "gpt-3.5-turbo",
          }),
        }),
      }),
    }),
  });

  return $.runAgent<{ task: string }>({
    properties: { task },
    agent: $.step.generateNextStepLoop({
      actions: [searchWikipediaAction, readWikipediaArticleAction],
      actionFormat: $.action.format.flexibleJson(),
      prompt: $.prompt.concatChatPrompts(
        async ({ runState: { task } }) => [
          {
            role: "system",
            content: `## ROLE
You are an knowledge worker that answers questions using Wikipedia content. You speak perfect JSON.

## CONSTRAINTS
All facts for your answer must be from Wikipedia articles that you have read.

## TASK
${task}`,
          },
        ],
        $.prompt.availableActionsChatPrompt(),
        $.prompt.recentStepsChatPrompt({ maxSteps: 6 })
      ),
      model: $.provider.openai.chatModel({
        apiKey: openAiApiKey,
        model: "gpt-3.5-turbo",
      }),
    }),
    controller: $.agent.controller.maxSteps(20),
    observer: $.agent.observer.showRunInConsole({ name: "Wikipedia Agent" }),
  });
}
```
