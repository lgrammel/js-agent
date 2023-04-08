import axios from "axios";
import { convert } from "html-to-text";
import { ToolExecutor } from "../ToolExecutor.js";
import {
  SummarizeWebpageInput,
  SummarizeWebpageOutput,
} from "./SummarizeWebpageAction.js";
import { RecursiveCharacterSplitter } from "../../../component/splitter/RecursiveCharacterSplitter.js";
import { TextSummarizer } from "../../../component/text-summarizer/TextSummarizer.js";

export class SummarizeWebpageExecutor
  implements ToolExecutor<SummarizeWebpageInput, SummarizeWebpageOutput>
{
  readonly summarizer: TextSummarizer;

  constructor({ summarizer }: { summarizer: TextSummarizer }) {
    this.summarizer = summarizer;
  }

  async execute({ input: { topic, url } }: { input: SummarizeWebpageInput }) {
    const result = await axios.get(url);

    let text = convert(result.data);

    // remove all links in square brackets
    text = text.replace(/\[.*?\]/g, "");

    const chunks = await new RecursiveCharacterSplitter({
      maxCharactersByChunk: 4096 * 4,
    }).split({ text });

    const chunkSummaries = await getChunkSummaries({
      chunks,
      query: topic,
      textSummarizer: this.summarizer,
    });

    // TODO additional summarization pass to get final summary

    return {
      summary: `Summarized website ${url} according to topic ${topic}.`,
      output: {
        summary: chunkSummaries.join("\n\n"),
      },
    };
  }
}

async function getChunkSummaries({
  chunks,
  query,
  textSummarizer,
}: {
  chunks: Array<string>;
  query: string;
  textSummarizer: TextSummarizer;
}): Promise<Array<string>> {
  const chunkSummaries = [];
  for (const chunk of chunks) {
    const summary = await textSummarizer.summarizeText(
      {
        text: chunk,
        topic: query,
      },
      undefined // TODO pass through context
    );

    chunkSummaries.push(summary);
  }
  return chunkSummaries;
}
