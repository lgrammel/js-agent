import { TextSummarizer } from "../../../component/text-summarizer/TextSummarizer.js";
import { WebpageTextExtractor } from "../../../component/webpage-text-extractor/WebpageTextExtractor.js";
import { ToolExecutor } from "../ToolExecutor.js";
import {
  SummarizeWebpageInput,
  SummarizeWebpageOutput,
} from "./SummarizeWebpageAction.js";

export class SummarizeWebpageExecutor
  implements ToolExecutor<SummarizeWebpageInput, SummarizeWebpageOutput>
{
  readonly summarizer: TextSummarizer;
  readonly webpageTextExtractor: WebpageTextExtractor;

  constructor({
    summarizer,
    webpageTextExtractor,
  }: {
    summarizer: TextSummarizer;
    webpageTextExtractor: WebpageTextExtractor;
  }) {
    this.summarizer = summarizer;
    this.webpageTextExtractor = webpageTextExtractor;
  }

  async execute({ input: { topic, url } }: { input: SummarizeWebpageInput }) {
    return {
      summary: `Summarized website ${url} according to topic ${topic}.`,
      output: {
        summary: await this.summarizer.summarizeText(
          {
            text: await this.webpageTextExtractor.extractText({ url }),
            topic,
          },
          undefined
        ),
      },
    };
  }
}
