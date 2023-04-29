---
sidebar_position: 3
---

# Agents

## What is an agent?

An agent flexibly solves a user's task by using large language models (LLM), memory (embeddings), and tools (e.g., search, analyzing data, etc.).

A basic agent works like this:

```mermaid
graph LR;

TASK["task"];
CALL_LLM["call LLM"];
USE_TOOL["use tool"];
DONE["done"];

TASK-->CALL_LLM;
CALL_LLM-->USE_TOOL;
CALL_LLM-->DONE;
USE_TOOL-->CALL_LLM;
```

The critical piece is that **the language model response determines what tool to use**.
This enables the agent to be flexible and solve a wide variety of tasks.

Calling the LLM requires creating a prompt and parsing its response.
Here is the same diagram with a bit more detail:

```mermaid
graph LR;

TASK["task"];
CREATE_LLM_PROMPT["create LLM prompt"];
CALL_LLM["call LLM"];
PARSE_LLM_RESPONSE["parse LLM response"];
USE_TOOL["use tool"];
DONE["done"];

TASK-->CREATE_LLM_PROMPT
CREATE_LLM_PROMPT-->CALL_LLM;
CALL_LLM-->PARSE_LLM_RESPONSE;
PARSE_LLM_RESPONSE-->USE_TOOL;
PARSE_LLM_RESPONSE-->DONE;
USE_TOOL-->CREATE_LLM_PROMPT;
```

There are other variants of agents that are much more complex and involve self-calls, planning, memory, and more.

## Agent composition

Agents add several new concepts like steps, tools, and runs. You can learn more in the [agent tutorials](/tutorial/wikipedia-agent).
