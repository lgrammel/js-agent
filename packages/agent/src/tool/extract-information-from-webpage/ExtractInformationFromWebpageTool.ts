import zod from "zod";
import { FormatResultFunction } from "../../action/FormatResultFunction";
import { RunContext } from "../../agent/RunContext";
import { htmlToText } from "../../convert/htmlToText";
import { webpageAsHtmlText } from "../../source";
import { ExtractFunction, load } from "../../text";
import { ExecuteToolFunction } from "../ExecuteToolFunction";
import { createToolAction } from "../ToolAction";

export type ExtractInformationFromWebpageInput = {
  topic: string;
  url: string;
};

export type ExtractInformationFromWebpageOutput = {
  extractedInformation: string;
};

export const extractInformationFromWebpage = ({
  id = "extract-information-from-webpage",
  description = "Extract information from a webpage considering a topic.",
  inputExample = {
    topic: "{information that I want to extract from the webpage}",
    url: "{https://www.example.com}",
  },
  execute,
  formatResult = ({ input, output: { extractedInformation } }) =>
    `## Extracted information on topic '${input.topic}' from ${input.url}\n${extractedInformation}`,
}: {
  id?: string;
  description?: string;
  inputExample?: ExtractInformationFromWebpageInput;
  execute: ExecuteToolFunction<
    ExtractInformationFromWebpageInput,
    ExtractInformationFromWebpageOutput
  >;
  formatResult?: FormatResultFunction<
    ExtractInformationFromWebpageInput,
    ExtractInformationFromWebpageOutput
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
      extractedInformation: zod.string(),
    }),
    inputExample,
    execute,
    formatResult,
  });

export const executeExtractInformationFromWebpage =
  <RUN_STATE>({
    loadText = load({
      from: webpageAsHtmlText(),
      convert: htmlToText(),
    }),
    extract,
  }: {
    loadText?: (options: { url: string }) => PromiseLike<string>;
    extract: ExtractFunction;
  }): ExecuteToolFunction<
    ExtractInformationFromWebpageInput,
    ExtractInformationFromWebpageOutput
  > =>
  async (
    { input: { topic, url } }: { input: ExtractInformationFromWebpageInput },
    context: RunContext
  ) => ({
    summary: `Extracted information on topic ${topic} from website ${url}.`,
    output: {
      extractedInformation: await extract(
        {
          text: await loadText({ url }),
          topic,
        },
        context
      ),
    },
  });
