---
sidebar_position: 2
title: Tutorial - Wikipedia Agent
---

# Overview

In this tutorial, we'll create an agent that answers questions by searching and reading [Wikipedia](https://www.wikipedia.org/) articles.
You can find the complete code in the [Wikipedia agent example](https://github.com/lgrammel/js-agent/tree/main/examples/wikipedia).

The agent will use the following components:

- OpenAI `gpt-3.5-turbo` chat completion model
- A loop in which the agent determines and executes steps ("GenerateNextStepLoop")
- A custom prompt
- Wikipedia search tool (implemented using a [Programmable Search Engine](https://programmablesearchengine.google.com/))
- Wikipedia article reading tool
- Command line interface and console logger that shows the agent's progress

This is the high-level flow of the agent:

```mermaid
graph TD;
    CONSOLE_LOGGER["log to console"];
    DONE["done"]

    CLI-->TASK;
    agent-->CONSOLE_LOGGER;

    subgraph agent["Wikipedia QA Agent"]
        TASK["task"];
        CREATE_PROMPT["create Prompt"]
        CALL_LLM["call gpt-3.5-turbo"]
        PARSE_GPT_RESPONSE["parse gpt-3.5-turbo response"]
        SEARCH_WIKIPEDIA["search Wikipedia"]
        READ_WIKIPEDIA["read Wikipedia article"]

        TASK-->CREATE_PROMPT
        CREATE_PROMPT-->CALL_LLM;
        CALL_LLM-->PARSE_GPT_RESPONSE;
        PARSE_GPT_RESPONSE-->SEARCH_WIKIPEDIA;
        SEARCH_WIKIPEDIA-->CREATE_PROMPT;
        PARSE_GPT_RESPONSE-->READ_WIKIPEDIA;
        READ_WIKIPEDIA-->CREATE_PROMPT;
        PARSE_GPT_RESPONSE-->CALL_LLM;
    end

    PARSE_GPT_RESPONSE-->DONE;
```
