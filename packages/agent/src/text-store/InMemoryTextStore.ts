import { RunContext } from "../agent";
import { EmbedFunction } from "../embedding/EmbedFunction";
import { cosineSimilarity } from "../util/cosineSimilarity";
import { createNextId } from "../util/createNextId";

export class InMemoryTextStore {
  private readonly embed: EmbedFunction<number[]>;
  private readonly nextId = createNextId();

  private readonly texts: Map<
    string,
    {
      id: string;
      embedding: number[];
      text: string;
    }
  > = new Map();

  constructor({ embed }: { embed: EmbedFunction<number[]> }) {
    this.embed = embed;
  }

  async store(
    { text }: { text: string },
    context: RunContext
  ): Promise<{ id: string }> {
    const id = this.nextId();
    const embedding = await this.embed({ value: text }, context);

    this.texts.set(id, { id, embedding, text });

    return { id };
  }

  async retrieve(
    {
      query,
      maxResults = 5,
      similarityThreshold = 0.5,
    }: { query: string; maxResults?: number; similarityThreshold: number },
    context: RunContext
  ): Promise<{ id: string; text: string; similarity: number }[]> {
    const queryEmbedding = await this.embed({ value: query }, context);

    const textSimilarities = [...this.texts.values()]
      .map((entry) => ({
        id: entry.id,
        similarity: cosineSimilarity(entry.embedding, queryEmbedding),
        text: entry.text,
      }))
      .filter((entry) => entry.similarity > similarityThreshold);

    textSimilarities.sort((a, b) => b.similarity - a.similarity);

    return textSimilarities.slice(0, maxResults);
  }
}
