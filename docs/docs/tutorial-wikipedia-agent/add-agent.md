---
sidebar_position: 4
title: Add agent
---

# Add agent

Now we're ready to create a basic agent. Let's update the `runWikipediaAgent` function with the following code:

```typescript
const chatGpt = $.provider.openai.chatModel({
  apiKey: openAiApiKey,
  model: "gpt-3.5-turbo",
});

return $.runAgent<{ task: string }>({
  properties: { task },
  agent: $.step.generateNextStepLoop({
    actions: [],
    actionFormat: $.action.format.flexibleJson(),
    prompt: async ({ runState: { task } }) => [
      { role: "user" as const, content: `${task}` },
    ],
    model: chatGpt,
  }),
  controller: $.agent.controller.maxSteps(3),
  observer: $.agent.observer.showRunInConsole({
    name: "Wikipedia Agent",
  }),
});
```

When you run it, it'll output the basic LLM answer to the console until the maximum number of steps is reached:

```bash
❯ npx ts-node src/agent.ts "how many people live in BC, Canada?"
### Wikipedia Agent ###
{ task: 'how many people live in BC, Canada?' }

Thinking…
As an AI language model, I do not have access to real-time data. However, according to the latest census conducted in 2016, the population of British Columbia, Canada was approximately 4.6 million.

Thinking…
As an AI language model, I do not have access to real-time data. However, according to the latest census conducted in 2016, the population of British Columbia, Canada was approximately 4.6 million.

Thinking…
As an AI language model, I do not have access to real-time data. However, according to the latest census conducted in 2016, the population of British Columbia, Canada was approximately 4.6 million.

Cancelled: Maximum number of steps (3) exceeded.
```

Let's dig into the code.

`$.runAgent` runs an agent.
It is typed to the properties of the agent, which are also its input.
We pass in the `task` as a property:

```typescript
return $.runAgent<{ task: string }>({
  properties: { task },
  // ...
});
```

The `agent` property contains the root step of the agent.
We use a `$.step.generateNextStepLoop` step, which generates steps using the LLM until the agent is done:

```typescript
return $.runAgent<...>({
  // ...
  agent: $.step.generateNextStepLoop({
    actions: [],
    actionFormat: $.action.format.flexibleJson(),
    prompt: async ({ runState: { task } }) => [
      { role: "user" as const, content: `${task}` },
    ],
    model: chatGpt,
  }),
```

The loop is configured with our earlier prompt function and the `chatGpt` model.
This prompt is used when calling the `chatGpt` model generate function.
We'll configure and talk about the actions later.

Because the agent has no actions yet and does not know when to stop, we limit the maximum number of steps to 3:

```typescript
return $.runAgent<...>({
  // ...
  controller: $.agent.controller.maxSteps(3),
```

And finally, we use an observer that outputs the agent's run to the console:

```typescript
return $.runAgent<...>({
  // ...
  observer: $.agent.observer.showRunInConsole({
    name: "Wikipedia Agent",
  }),
```

With the basic agent in place, let's add some tools next.
