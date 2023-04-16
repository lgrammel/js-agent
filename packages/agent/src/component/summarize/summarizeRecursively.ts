import { SplitFunction } from "../split";
import { SummarizeFunction } from "./SummarizeFunction";

export const summarizeRecursively =
  ({
    summarize,
    split,
  }: {
    summarize: SummarizeFunction;
    split: SplitFunction;
  }): SummarizeFunction =>
  async ({ text, topic }) =>
    _summarizeRecursively({
      text,
      topic,
      summarize: summarize,
      split: split,
    });

async function _summarizeRecursively({
  summarize,
  split,
  text,
  topic,
}: {
  summarize: SummarizeFunction;
  split: SplitFunction;
  text: string;
  topic: string;
}): Promise<string> {
  const chunks = await split({ text });

  const chunkSummaries = [];
  for (const chunk of chunks) {
    chunkSummaries.push(await summarize({ text: chunk, topic }));
  }

  if (chunkSummaries.length === 1) {
    return chunkSummaries[0];
  }

  // recursive summarization: will split joined summaries as needed to stay
  // within the allowed size limit of the splitter.
  return _summarizeRecursively({
    text: chunkSummaries.join("\n\n"),
    topic,
    summarize: summarize,
    split: split,
  });
}
