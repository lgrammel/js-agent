import * as $ from "js-agent";
import fs from "node:fs/promises";

export async function splitAndEmbedText({
  textFilePath,
  openAiApiKey,
}: {
  textFilePath: string;
  openAiApiKey: string;
}) {
  const text = await fs.readFile(textFilePath, "utf8");

  const chunks = await $.text.splitRecursivelyAtToken({
    text,
    tokenizer: $.tokenizer.openai.forModel({
      model: "text-embedding-ada-002",
    }),
    maxChunkSize: 128,
  });

  const embeddings = [];
  for (const chunk of chunks) {
    const response = await $.api.openai.generateEmbedding({
      model: "text-embedding-ada-002",
      apiKey: openAiApiKey,
      input: chunk,
    });

    embeddings.push({
      chunk,
      embedding: response.data[0].embedding,
    });
  }

  console.log(embeddings);
}
