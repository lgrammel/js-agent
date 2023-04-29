---
sidebar_position: 2
---

# Function composition

More complex functions in JS Agent are composed of other functions. You can pass in the component functions. This gives you full control while at the same time letting you benefit from the flow implemented in the composition.

To help you compose functions more easily, many functions have `.asFunction()` or similar methods.

Here is the example that creates a Twitter thread on a topic using the content of a PDF ([full example](https://github.com/lgrammel/js-agent/tree/main/examples/pdf-to-twitter-thread)):

```typescript
import * as $ from "js-agent";

// ...

const rewriteAsTwitterThread = $.text.splitExtractRewrite.asExtractFunction({
  split: $.text.splitRecursivelyAtCharacter.asSplitFunction({
    maxChunkSize: 1024 * 4,
  }),
  extract: $.text.generateText.asFunction({
    model: gpt4,
    prompt: $.prompt.extractAndExcludeChatPrompt({
      excludeKeyword: "IRRELEVANT",
    }),
  }),
  include: (text) => text !== "IRRELEVANT",
  rewrite: $.text.generateText.asFunction({
    model: gpt4,
    prompt: async ({ text, topic }) => [
      {
        role: "user" as const,
        content: `## TOPIC\n${topic}`,
      },
      {
        role: "system" as const,
        content: `## TASK
Rewrite the content below into a coherent twitter thread on the topic above.
Include all relevant information about the topic.
Discard all irrelevant information.
Separate each tweet with ---`,
      },
      {
        role: "user" as const,
        content: `## CONTENT\n${text}`,
      },
    ],
  }),
});
```

The `rewriteAsTwitterThread` function has the following signature (and can be called directly):

```typescript
type RewriteAsTwitterThreadFunction = (
  options: {
    text: string;
    topic: string;
  },
  context: $.agent.RunContext
) => PromiseLike<string>;
```

The `context` parameter is a part of more complex functions. It records any LLM calls for cost tracking and logging.
