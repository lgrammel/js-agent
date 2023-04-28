---
sidebar_position: 1
---

# Abstraction Levels

You can use the functionality of the JS Agent library at different abstraction levels: direct function calls, function composition and agent composition.

## Direct function calls

You can use all almost all helper functions in JS Agent directly. This includes functions to call language models, text splitters, data loaders and more.

Here is an example of splitting a text into chunks and using the OpenAI embedding API directly to get the embedding of each chunk ([full example](https://github.com/lgrammel/js-agent/tree/main/examples/split-and-embed-text)):

```typescript
const chunks = await $.text.splitRecursivelyAtToken({
  text,
  tokenizer: $.provider.openai.gptTokenizer(),
  maxChunkSize: 128,
});

const embeddings = [];
for (const chunk of chunks) {
  const response = await $.provider.openai.api.generateEmbedding({
    model: "text-embedding-ada-002",
    apiKey: openAiApiKey,
    input: chunk,
  });

  embeddings.push({
    chunk,
    embedding: response.data[0].embedding,
  });
}
```

## Function composition

More complex functions in JS Agent are composed of other functions. You can pass in the component functions. This gives you full control while at the same time letting you benefit from the flow implemented in the composition.

To help you compose functions more easily, many functions have `.asFunction()` or similar methods.

Here is the example that creates a Twitter thread on a topic using the content of a PDF ([full example](https://github.com/lgrammel/js-agent/tree/main/examples/pdf-to-twitter-thread)):

```typescript
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

## Agent composition

Agents add several new concepts like steps, tools, and runs. You can learn more in the [agent tutorials](/docs/intro).
