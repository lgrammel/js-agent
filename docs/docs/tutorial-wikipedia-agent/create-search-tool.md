---
sidebar_position: 5
title: Create search tool
---

# Create Wikipedia search tool

## Create a programmable search engine

First, you need to create a [programmable search engine](https://programmablesearchengine.google.com/about/) for Wikipedia.

When you set up the search engine, configure the site to be `en.wikipedia.org/*`.
You can find the search engine id (which is the `cx` parameter) on the overview page.
You can get the [search engine key in the documentation](https://developers.google.com/custom-search/v1/introduction) ("Get a Key", requires a Google project).

## Create the search action

JS Agent has a built-in tool for using programmable search engines.
You can use it to create a search action.

:::info
Tools are actions that run (potentially external) code in some fashion. They don't affect the control flow directly. There are other kinds of actions, e.g. the "done" action, that an agent can select.
:::

```typescript
const searchWikipediaAction = $.tool.programmableGoogleSearchEngineAction<{
  task: string;
}>({
  id: "search-wikipedia",
  description: "Search wikipedia using a search term. Returns a list of pages.",
  execute: $.tool.executeProgrammableGoogleSearchEngineAction({
    key: "your search engine key",
    cx: "your search engine id",
  }),
});
```

The `id` and `description` parameters are included in the LLM prompt.
It is important to choose names and descriptions that are easy to understand for the LLM, because they will determine if and when the agent chooses to use this action.

The `execution` parameter contains the function that is running the tool code.
It is configurable to e.g. be able to use executors that run remotely (e.g. in a Docker container) and to provide additional flexibility.
