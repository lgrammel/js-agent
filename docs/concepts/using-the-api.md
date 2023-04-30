---
sidebar_position: 1
---

# Using the API

You can use all almost all [JS Agent API](/api/modules) functions directly. This includes functions to call language models, text splitters, data loaders and more.

Here is an example of splitting a text into chunks and using the OpenAI embedding API directly to get the embedding of each chunk ([full example](https://github.com/lgrammel/js-agent/tree/main/examples/split-and-embed-text)):

```typescript
import * as $ from "js-agent";

const openai = $.provider.openai;

const chunks = await $.text.splitRecursivelyAtToken({
  text,
  tokenizer: openai.tokenizer.forModel({
    model: "text-embedding-ada-002",
  }),
  maxChunkSize: 128,
});

const embeddings = [];
for (const chunk of chunks) {
  const response = await openai.api.generateEmbedding({
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
