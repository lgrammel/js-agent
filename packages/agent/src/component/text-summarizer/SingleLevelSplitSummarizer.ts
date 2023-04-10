import { Splitter } from "../splitter/Splitter";
import { TextSummarizer } from "./TextSummarizer";

export class SingleLevelSplitSummarizer implements TextSummarizer {
  private summarizer: TextSummarizer;
  private splitter: Splitter;

  constructor({
    summarizer,
    splitter,
  }: {
    summarizer: TextSummarizer;
    splitter: Splitter;
  }) {
    this.summarizer = summarizer;
    this.splitter = splitter;
  }

  async summarizeText(
    { text, topic }: { text: string; topic: string },
    context: unknown
  ): Promise<string> {
    const chunks = await this.splitter.split({ text });

    const chunkSummaries = [];
    for (const chunk of chunks) {
      chunkSummaries.push(
        await this.summarizer.summarizeText({ text: chunk, topic }, context)
      );
    }

    if (chunkSummaries.length === 1) {
      return chunkSummaries[0];
    }

    return this.summarizer.summarizeText(
      {
        text: chunkSummaries.join("\n\n"),
        topic,
      },
      context
    );
  }
}