---
sidebar_position: 3
title: Setup LLM model
---

# Setup the LLM model

Next, we'll set up the LLM model and create the agent loop with a basic prompt.

## Load OpenAI API key

Update the code to load the OpenAI API key from the environment and inject it into the agent:

```typescript
const task = process.argv.slice(2).join(" ");

const openAiApiKey = process.env.OPENAI_API_KEY;
if (!openAiApiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}

runWikipediaAgent()
  .then(() => {})
  .catch((error) => {
    console.error(error);
  });

async function runWikipediaAgent() {
  console.log(openAiApiKey);
  console.log(task);
}
```

## Create the LLM model

First, import JS Agent:

```typescript
import * as $ from "js-agent";
```

You can then create the chat model in `runWikipediaAgent`:

```typescript
const chatGpt = $.provider.openai.chatModel({
  apiKey: openAiApiKey,
  model: "gpt-3.5-turbo",
});
```

## Call the model with a basic prompt

Once you have a model, you can call it directly with a basic prompt:

```typescript
const fullResponse = await chatGpt.generate([
  { role: "user" as const, content: task },
]);
```

And extract the main output from its response:

```typescript
const output = await chatGpt.extractOutput(fullResponse);

console.log(output);
```

Putting this together, this is the current code:

```typescript
import * as $ from "js-agent";

const task = process.argv.slice(2).join(" ");

const openAiApiKey = process.env.OPENAI_API_KEY;
if (!openAiApiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}

runWikipediaAgent()
  .then(() => {})
  .catch((error) => {
    console.error(error);
  });

async function runWikipediaAgent() {
  const chatGpt = $.provider.openai.chatModel({
    apiKey: openAiApiKey,
    model: "gpt-3.5-turbo",
  });

  const fullResponse = await chatGpt.generate([
    { role: "user" as const, content: task },
  ]);

  const output = await chatGpt.extractOutput(fullResponse);

  console.log(task);
  console.log(output);
}
```

When you run it, it'll use the knowledge that's trained into the LLM to answer the question:

```bash
❯ npx ts-node src/agent.ts "how many people live in BC, Canada?"
how many people live in BC, Canada?
As an AI language model, I do not have access to real-time data. However, according to the latest census conducted in 2016, the population of British Columbia, Canada was approximately 4.6 million.
```
