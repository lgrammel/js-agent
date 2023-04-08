# GPTAgent.js: Automatic AI Agents with TS/JS

GPTAgent.js is a framework for creating automated AI agents. It uses OpenAI GPT-4 to generate the completions.

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

## Requirements

- **GPT-4 access**
- node 18
- pnpm
