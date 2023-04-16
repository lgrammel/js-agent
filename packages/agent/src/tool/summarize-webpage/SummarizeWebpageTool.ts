import zod from "zod";
import { FormatResultFunction } from "../../action/FormatResultFunction";
import { ExecuteToolFunction } from "../ExecuteToolFunction";
import { createToolAction } from "../ToolAction";
import { SummarizeFunction } from "../../component/summarize/SummarizeFunction";
import { ExtractWebpageTextFunction } from "../../component";

export type SummarizeWebpageInput = {
  topic: string;
  url: string;
};

export type SummarizeWebpageOutput = {
  summary: string;
};

export const summarizeWebpage = ({
  id = "summarize-website",
  description = "Summarize a webpage considering a topic.",
  inputExample = {
    topic: "{information that I want to extract from the website}",
    url: "{https://www.example.com}",
  },
  execute,
  formatResult = ({ input, output: { summary } }) =>
    `## Summary of ${input.url} for topic '${input.topic}'\n${summary}`,
}: {
  id?: string;
  description?: string;
  inputExample?: SummarizeWebpageInput;
  execute: ExecuteToolFunction<SummarizeWebpageInput, SummarizeWebpageOutput>;
  formatResult?: FormatResultFunction<
    SummarizeWebpageInput,
    SummarizeWebpageOutput
  >;
}) =>
  createToolAction({
    id,
    description,
    inputSchema: zod.object({
      topic: zod.string(),
      url: zod.string(),
    }),
    outputSchema: zod.object({
      summary: zod.string(),
    }),
    inputExample,
    execute,
    formatResult,
  });

export const executeSummarizeWebpage =
  ({
    summarize,
    extractText,
  }: {
    summarize: SummarizeFunction;
    extractText: ExtractWebpageTextFunction;
  }): ExecuteToolFunction<SummarizeWebpageInput, SummarizeWebpageOutput> =>
  async ({ input: { topic, url } }: { input: SummarizeWebpageInput }) => ({
    summary: `Summarized website ${url} according to topic ${topic}.`,
    output: {
      summary: await summarize({
        text: await extractText({ url }),
        topic,
      }),
    },
  });
