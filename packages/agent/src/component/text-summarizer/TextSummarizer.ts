export interface TextSummarizer {
  summarizeText(
    {}: { text: string; topic: string },
    context: unknown
  ): PromiseLike<string>;
}
