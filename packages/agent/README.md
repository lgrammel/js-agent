# JS Agent: Build AI Agents with JS & TS

JS Agent is a composable and extensible framework for creating AI agents with TypeScript/JavaScript.

Creating AI agents requires considerable experimentation to achieve good results.
JS Agent makes the agent configuration explicit, so you can easily understand and adjust what the agent.

## Examples

**[BabyAGI](https://github.com/lgrammel/js-agent/tree/main/examples/babyagi)**:
JS Agent implementation of [BabyAGI](https://github.com/yoheinakajima/babyagi).

**[JavaScript/TypeScript developer](https://github.com/lgrammel/js-agent/tree/main/examples/javascript-developer)**:
An automated developer agent that works in a docker container.
It can read files, write files and execute commands.
You can use it to document code, write tests, update tests and features, etc.

**[Wikipedia Question-Answering](https://github.com/lgrammel/js-agent/tree/main/examples/wikipedia)**:
An agent that has access to a wikipedia search engine and can read wikipedia articles. You can use it to answer questions about wikipedia content.

## Features

- Agent definition and execution
  - Observable agent runs (to support console output, UIs, server runs, webapps, etc.)
- Supported LLM models
  - OpenAI text completion models (`text-davinci-003` etc.)
  - OpenAI chat completion models (`gpt-4`, `gpt-3.5-turbo`)
- Prompt template creation
  - Create templates for text prompts and chat prompts
- Actions and Tools
  - Read file, write file, run command, use programmable search engine, summarize website according to topic, ask user for input
- Text functions
  - Extract text from webpage
  - Split text into chunks
  - Summarize text recursively
- General utils
  - LLM call retry with exponential backoff

## Usage

```sh
npm install js-agent
```

See examples for details on how to implement and run an agent.

**⚠️ JS Agent is currently in its initial experimental phase. Prior to reaching version 0.1, there may breaking changes in each release.**

## Features

- **agents and agent runs**
- **dynamic loops**
- **tools**: read file, write file, run command, use programmable search engine, summarize website according to topic
- **agent/executor separation (optional)**: Run the executor in a safe environment (e.g. Docker container) where it can use the command line, install libraries, etc.

## Design Principles

- **typed**: Provide as much typing as possible to support discovery and ensure safety.
- **use functional programming for object assembly**: All objects that are immutable are assembled using functional programming. Object-orientation is only used for objects that have a changeable state (e.g. `Step` and `AgentRun`).
- **support progressive refinement of agent specifications**: Agent specifications should be easy to write and every building block should provide good defaults. At the same time, it should be possible to easily override the defaults with specific settings, prompts, etc.
- **build for production**: JS Agent will have first-class support for logging, associating LLM calls and cost tracking with agent runs, etc.

## GPT-4 vs GPT-3.5-turbo

For agents, it is recommended to use GPT-4. GPT-3.5-Turbo has trouble following instructions, accurately extracting information from text, and tends to hallucinate answers. However, GPT-4 can be expensive and is not fully available yet.

## Example Agent Definition

```ts
import * as $ from "js-agent";

export async function runWikipediaAgent({
  wikipediaSearchKey,
  wikipediaSearchCx,
  openAiApiKey,
  objective,
}: {
  openAiApiKey: string;
  wikipediaSearchKey: string;
  wikipediaSearchCx: string;
  objective: string;
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

  const readWikipediaArticleAction = $.tool.summarizeWebpage({
    id: "read-wikipedia-article",
    description:
      "Read a wikipedia article and summarize it considering the query.",
    inputExample: {
      url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
      topic: "{query that you are answering}",
    },
    execute: $.tool.executeSummarizeWebpage({
      extractText: $.text.extractWebpageTextFromHtml(),
      summarize: $.text.summarizeRecursively({
        split: $.text.splitRecursivelyAtCharacter({
          // maxCharactersPerChunk can be increased to 4096 * 4 when you use gpt-4:
          maxCharactersPerChunk: 2048 * 4,
        }),
        summarize: $.text.generate({
          prompt: $.text.SummarizeChatPrompt,
          generate: $.provider.openai.generateChatText({
            apiKey: openAiApiKey,
            model: "gpt-3.5-turbo",
          }),
          processOutput: async (output) => output.trim(),
        }),
      }),
    }),
  });

  return $.runAgent({
    agent: $.step.createGenerateNextStepLoop({
      actionRegistry: new $.action.ActionRegistry({
        actions: [searchWikipediaAction, readWikipediaArticleAction],
        format: new $.action.format.JsonActionFormat(),
      }),
      prompt: $.prompt.concatChatPrompts<$.step.GenerateNextStepLoopContext>(
        $.prompt.sectionsChatPrompt({
          role: "system",
          getSections: async () => [
            {
              title: "Role",
              // "You speak perfect JSON" helps getting gpt-3.5-turbo to provide structured json at the end
              content: `You are an knowledge worker that answers questions using Wikipedia content. You speak perfect JSON.`,
            },
            {
              title: "Constraints",
              content: `Make sure all facts for your answer are from Wikipedia articles that you have read.`,
            },
          ],
        }),
        $.prompt.taskChatPrompt(),
        $.prompt.availableActionsChatPrompt(),
        $.prompt.recentStepsChatPrompt({ maxSteps: 6 })
      ),
      generate: $.provider.openai.generateChatText({
        apiKey: openAiApiKey,
        model: "gpt-3.5-turbo",
      }),
    }),
    observer: $.agent.outputAgentRunOnConsole({
      name: "Wikipedia Agent",
    }),
    objective,
  });
}
```

## Example Output

![wikipedia](https://github.com/lgrammel/js-agent/blob/main/examples/wikipedia/screenshot/wikipedia-qa-001.png)

## Requirements

- node 18
- pnpm
- OpenAI API key
