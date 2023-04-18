# JS Agent: Build AI Agents with JS & TS

JS Agent is a composable and extensible framework for creating AI agents with TypeScript/JavaScript.

Creating AI agents requires considerable experimentation to achieve good results.
JS Agent makes the agent configuration explicit, so you can easily understand and adjust what the agent.

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
  - Optional agent/executor separation (e.g. run the executor in a sandbox environment such as a Docker container)
- Text functions
  - Extract text from webpage
  - Split text into chunks
  - Summarize text recursively
- General utils
  - LLM call retry with exponential backoff

## Examples

**[BabyAGI](https://github.com/lgrammel/js-agent/tree/main/examples/babyagi)**:
JS Agent implementation of [BabyAGI](https://github.com/yoheinakajima/babyagi).

**[JavaScript/TypeScript developer](https://github.com/lgrammel/js-agent/tree/main/examples/javascript-developer)**:
An automated developer agent that works in a docker container.
It can read files, write files and execute commands.
You can use it to document code, write tests, update tests and features, etc.

**[Wikipedia Question-Answering](https://github.com/lgrammel/js-agent/tree/main/examples/wikipedia)**:
An agent that has access to a wikipedia search engine and can read wikipedia articles. You can use it to answer questions about wikipedia content.

## Design Principles

- **typed**: Provide as much typing as possible to support discovery and ensure safety.
- **composable**: The individual pieces should have a good separation of concerns and be easy to combine.
- **extensible**: It should be easy for users to add their own tools, providers, actions, agent steps, etc.
- **use functional programming for object assembly**: All objects that are immutable are assembled using functional programming. Object-orientation is only used for objects that have a changeable state (e.g. `Step` and `AgentRun`).
- **support progressive refinement of agent specifications**: Agent specifications should be easy to write and every building block should provide good defaults. At the same time, it should be possible to easily override the defaults with specific settings, prompts, etc.
- **build for production**: JS Agent will have first-class support for logging, associating LLM calls and cost tracking with agent runs, etc.

## Getting Started

```sh
npm install js-agent
```

See examples for details on how to implement and run an agent.

**⚠️ JS Agent is currently in its initial experimental phase. Prior to reaching version 0.1, there may breaking changes in each release.**
