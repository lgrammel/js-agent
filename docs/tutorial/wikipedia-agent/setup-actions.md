---
sidebar_position: 7
title: Setup actions
---

# Setup actions

## Add actions to the agent

Now that we have a search Wikipedia and a read article action, we can set up the actions in the Wikipedia agent.
Let's add them to the actions section of `$.step.generateNextStepLoop`:

```typescript
return $.runAgent<...>({
  // ...
  agent: $.step.generateNextStepLoop({
    actions: [searchWikipediaAction, readWikipediaArticleAction],
    actionFormat: $.action.format.flexibleJson(),
```

The `actionFormat` parses the first flat JSON object in the LLM output.
It is specifically designed for ChatGPT, which tends to output the JSON object in various places in the response.

## Create a better prompt

The agent has yet to be made aware of the actions and it does not know that it should read Wikipedia articles.
Let's improve the agent prompt.

```typescript
return $.runAgent<...>({
  // ...
  prompt: $.prompt.concatChatPrompts(
    async ({ runState: { task } }) => [
      {
        role: "system",
        content: `## ROLE
You are an knowledge worker that answers questions using Wikipedia content.

## CONSTRAINTS
All facts for your answer must be from Wikipedia articles that you have read.

## TASK
${task}`,
     },
    ],
    $.prompt.availableActionsChatPrompt(),
    $.prompt.recentStepsChatPrompt({ maxSteps: 6 })
  ),
```

Let's dissect the prompt.
We first tell the model about its general role, and then we instruct it always to read Wikipedia articles to find the answer and give it the task.

```
## ROLE
You are an knowledge worker that answers questions using Wikipedia content.

## CONSTRAINTS
All facts for your answer must be from Wikipedia articles that you have read.

## TASK
${task}
```

The next part informs the model about the available actions.
After that, we ensure to include the last steps the model took in the prompt for the next iteration.
This provides some basic memory required for moving the agent forward in its task.

```typescript
return $.runAgent<...>({
  // ...
  prompt: $.prompt.concatChatPrompts(
    // ...
    $.prompt.availableActionsChatPrompt(),
    $.prompt.recentStepsChatPrompt({ maxSteps: 6 })
  ),
```

The different prompts are concatenated using `$.prompt.concatChatPrompts`.

## Update the maximum steps

The agent is now ready to be run.
We increase the maximum number of steps to 10 to provide the agent with more time to find the answer.

```typescript
return $.runAgent<...>({
  // ...
  controller: $.agent.controller.maxSteps(10),
```
