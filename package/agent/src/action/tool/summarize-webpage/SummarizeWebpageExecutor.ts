import axios from "axios";
import { convert } from "html-to-text";
import { TextSummarizer } from "../../../component/text-summarizer/TextSummarizer.js";
import { ToolExecutor } from "../ToolExecutor.js";
import {
  SummarizeWebpageInput,
  SummarizeWebpageOutput,
} from "./SummarizeWebpageAction.js";

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

    return {
      summary: `Summarized website ${url} according to topic ${topic}.`,
      output: {
        summary: await this.summarizer.summarizeText(
          { text, topic },
          undefined
        ),
      },
    };
  }
}
