import * as $ from "js-agent";
import fs from "node:fs/promises";

export async function splitAndEmbed({
  textFilePath,
  openAiApiKey,
}: {
  textFilePath: string;
  openAiApiKey: string;
}) {
  const text = await fs.readFile(textFilePath, "utf8");

  const chunks = $.text.splitRecursivelyAtCharacter({
    text,
    maxCharactersPerChunk: 1024 * 4,
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

  console.log(embeddings);
}
