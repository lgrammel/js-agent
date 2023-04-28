import { RunContext } from "../../agent";
import { SplitFunction } from "../split";
import { ExtractFunction } from "./ExtractFunction";

export const splitExtractRewrite = async (
  {
    split,
    extract,
    include,
    rewrite,
    text,
    topic,
  }: {
    split: SplitFunction;
    extract: ExtractFunction;
    include: (text: string) => boolean;
    rewrite: ExtractFunction;
    text: string;
    topic: string;
  },
  context: RunContext
) => {
  const chunks = await split({ text });

  const extractedTexts = [];
  for (const chunk of chunks) {
    const extracted = await extract({ text: chunk, topic }, context);
    if (include(extracted)) {
      extractedTexts.push(extracted);
    }
  }

  return rewrite({ text: extractedTexts.join("\n\n"), topic }, context);
};

splitExtractRewrite.asExtractFunction =
  ({
    split,
    extract,
    include,
    rewrite,
  }: {
    split: SplitFunction;
    extract: ExtractFunction;
    include: (text: string) => boolean;
    rewrite: ExtractFunction;
  }): ExtractFunction =>
  async ({ text, topic }, context: RunContext) =>
    splitExtractRewrite(
      {
        split,
        extract,
        include,
        rewrite,
        text,
        topic,
      },
      context
    );
