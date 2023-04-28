---
sidebar_position: 8
title: Complete agent
---

# Wikipedia Agent

## Code

The agent now looks like this:

```typescript
import * as $ from "js-agent";

const task = process.argv.slice(2).join(" ");

const openAiApiKey = process.env.OPENAI_API_KEY;
if (!openAiApiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}

runWikipediaAgent({
  task,
  openAiApiKey,
})
  .then(() => {})
  .catch((error) => {
    console.error(error);
  });

async function runWikipediaAgent({
  task,
  openAiApiKey,
}: {
  task: string;
  openAiApiKey: string;
}) {
  const chatGpt = $.provider.openai.chatModel({
    apiKey: openAiApiKey,
    model: "gpt-3.5-turbo",
  });

  const searchWikipediaAction = $.tool.programmableGoogleSearchEngineAction({
    id: "search-wikipedia",
    description:
      "Search wikipedia using a search term. Returns a list of pages.",
    execute: $.tool.executeProgrammableGoogleSearchEngineAction({
      key: "your search engine key",
      cx: "your search engine id",
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
          tokenizer: $.provider.openai.gptTokenizer(),
          maxChunkSize: 2048, // needs to fit into a gpt-3.5-turbo prompt
        }),
        extract: $.text.generateText.asFunction({
          prompt: $.prompt.extractChatPrompt(),
          model: chatGpt,
        }),
      }),
    }),

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
      model: chatGpt,
    }),
    controller: $.agent.controller.maxSteps(10),
    observer: $.agent.observer.showRunInConsole({ name: "Wikipedia Agent" }),
  });
}
```

## Example Run

Here are the results of a test run:

```
❯ npx ts-node src/agent.ts "how many people live in BC, Canada?"
### Wikipedia Agent ###
{ task: 'how many people live in BC, Canada?' }

Thinking…
I will start by searching for the population of British Columbia, Canada on Wikipedia.

{
  "action": "search-wikipedia",
  "query": "population of british columbia canada"
}

Executing search-wikipedia…
## Found 5 search results.
### British Columbia - Wikipedia
https://en.wikipedia.org/wiki/British_Columbia
With an estimated population of 5.3 million as of 2022, it is Canada's third-most populous province. The capital of British Columbia is Victoria and its ...

### Vancouver - Wikipedia
https://en.wikipedia.org/wiki/Vancouver
Vancouver is a major city in western Canada, located in the Lower Mainland region of British Columbia. ... Vancouver has the highest population density in Canada, with over 5,700 ...

### Demographics of British Columbia - Wikipedia
https://en.wikipedia.org/wiki/Demographics_of_British_Columbia
Population of British Columbia 5.399 million (2023) ; Percentage of National Population: 13.2% (unchanged) ; Population Growth Rate: 5.6% ...

### Victoria, British Columbia - Wikipedia
https://en.wikipedia.org/wiki/Victoria,_British_Columbia
Victoria is the capital city of the Canadian province of British Columbia, on the southern ... In the 2021 Census of Population conducted by Statistics Canada, ...

### Surrey, British Columbia - Wikipedia
https://en.wikipedia.org/wiki/Surrey,_British_Columbia
In the 2021 Canadian census conducted by Statistics Canada, Surrey had a population of 568,322 living in 185,671 of its 195,098 total private dwellings, a ...


Thinking…
The third search result, "Demographics of British Columbia - Wikipedia", seems to be the most relevant. I will read the article and summarize it to answer the question.

{
  "action": "read-wikipedia-article",
  "url": "https://en.wikipedia.org/wiki/Demographics_of_British_Columbia",
  "topic": "population of British Columbia, Canada"
}

Executing read-wikipedia-article…
## Extracted information on topic 'population of British Columbia, Canada' from https://en.wikipedia.org/wiki/Demographics_of_British_Columbia
The population of British Columbia, Canada is 5.399 million as of 2023, which represents 13.2% of the national population. The population growth rate is 5.6%. In terms of visible minorities and indigenous peoples, 30.3% of the population in 2016 were visible minorities, and 5.9% were indigenous. The largest visible minority groups were South Asian, Chinese, and Black. In terms of immigration, in 2021, immigrants comprised 29.0% of the total population of British Columbia, with the largest immigrant groups being from China, India, and the Philippines. Finally, the 2021 Canadian census counted a total of 197,420 people who immigrated to British Columbia between 2016 and 2021.

Thinking…
According to the information I found on Wikipedia, the population of British Columbia, Canada is 5.399 million as of 2023.

{
  "action": "done"
}

Done
```
