import { RunContext } from "../../agent/RunContext";
import { SplitFunction } from "../split";
import { ExtractFunction } from "./ExtractFunction";

export const extractRecursively =
  ({
    split,
    extract,
  }: {
    split: SplitFunction;
    extract: ExtractFunction;
  }): ExtractFunction =>
  async ({ text, topic }, context: RunContext) =>
    _extractRecursively({
      text,
      topic,
      extract,
      split,
      context,
    });

async function _extractRecursively({
  extract,
  split,
  text,
  topic,
  context,
}: {
  extract: ExtractFunction;
  split: SplitFunction;
  text: string;
  topic: string;
  context: RunContext;
}): Promise<string> {
  const chunks = await split({ text });

  const extractedTexts = [];
  for (const chunk of chunks) {
    extractedTexts.push(await extract({ text: chunk, topic }, context));
  }

  if (extractedTexts.length === 1) {
    return extractedTexts[0];
  }

  // recursive summarization: will split joined summaries as needed to stay
  // within the allowed size limit of the splitter.
  return _extractRecursively({
    text: extractedTexts.join("\n\n"),
    topic,
    extract,
    split,
    context,
  });
}
