import { RunContext } from "../../agent/RunContext";
import { SplitFunction } from "../split";
import { ExtractFunction } from "./ExtractFunction";

export const extractAndRewrite =
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
  async ({ text, topic }, context: RunContext) => {
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
