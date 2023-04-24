---
sidebar_position: 6
title: Create read article tool
---

# Create read article tool

The read article action is implemented using the JS Agent `extractInformationFromWebpage` tool:

```typescript
const readWikipediaArticleAction = $.tool.extractInformationFromWebpage({
  id: "read-wikipedia-article",
  description:
    "Read a wikipedia article and summarize it considering the query.",
  inputExample: {
    url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
    topic: "{query that you are answering}",
  },
  execute: $.tool.executeExtractInformationFromWebpage({
    extract: $.text.extractRecursively({
      split: $.text.splitRecursivelyAtCharacter({
        maxCharactersPerChunk: 2048 * 4,
      }),
      extract: $.text.generateText({
        id: "summarize-wikipedia-article-chunk",
        prompt: $.prompt.extractChatPrompt(),
        model: chatGpt,
      }),
    }),
  }),
});
```

In addition to the `id` and the `description`, the action has an `inputExample` that will be shown to the LLM.
Input examples help with guiding the LLM to take the right action.
Every tool has a default input example that can be overridden.

The page is then summarized using text extraction.
It is split recursively until the chunks are small enough for Chat GPT to handle.
Chat GPT is used to generate a summary for each chunk and the concatenated summaries.

`$.prompt.extractChatPrompt()`, which is part of JS Agent, contains the following prompt:

```typescript
async ({ text, topic }: { text: string; topic: string }) => [
  {
    role: "user" as const,
    content: `## TOPIC\n${topic}`,
  },
  {
    role: "system" as const,
    content: `## ROLE
You are an expert at extracting information.
You need to extract and keep all the information on the topic above topic from the text below.
Only include information that is directly relevant for the topic.`,
  },
  {
    role: "user" as const,
    content: `## TEXT\n${text}`,
  },
];
```

Now that we have created a summarization tool, we can put everything together and craft a better agent prompt.
