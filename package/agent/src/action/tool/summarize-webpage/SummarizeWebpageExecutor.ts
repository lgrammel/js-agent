import axios from "axios";
import { convert } from "html-to-text";
import { GenerateTextFunction } from "../../../agent/generateGpt4Completion.js";
import { Action } from "../../Action.js";
import { ToolExecutor } from "../ToolExecutor.js";
import {
  SummarizeWebpageInput,
  SummarizeWebpageOutput,
} from "./SummarizeWebpageAction.js";

export class SummarizeWebpageExecutor
  implements ToolExecutor<SummarizeWebpageInput, SummarizeWebpageOutput>
{
  async execute({
    input: { topic, url },
    context: { generateText },
  }: {
    input: SummarizeWebpageInput;
    action: Action<SummarizeWebpageInput, SummarizeWebpageOutput>;
    context: {
      generateText: GenerateTextFunction;
    };
  }) {
    const result = await axios.get(url);

    let text = convert(result.data);

    // remove all links in square brackets
    text = text.replace(/\[.*?\]/g, "");

    // TODO true map reduce that takes chunk summaries and combines them
    const chunks = splitRecursively(text, 4096 * 4);
    const chunkSummaries = await getChunkSummaries({
      chunks,
      query: topic,
      generateText,
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

/**
 * Splits the text recursively in half until each chunk is shorter than maxLength.
 */
function splitRecursively(text: string, maxLength: number): Array<string> {
  if (text.length < maxLength) {
    return [text];
  }

  const half = Math.ceil(text.length / 2);
  const left = text.substring(0, half);
  const right = text.substring(half);

  return [
    ...splitRecursively(left, maxLength),
    ...splitRecursively(right, maxLength),
  ];
}

async function getChunkSummaries({
  chunks,
  query,
  generateText,
}: {
  chunks: Array<string>;
  query: string;
  generateText: GenerateTextFunction;
}): Promise<Array<string>> {
  const chunkSummaries = [];
  for (const chunk of chunks) {
    const response = await generateText({
      messages: [
        {
          role: "system",
          content: `You are an assistant that summarizes articles.
You have a specific query to answer and you want to keep all the information you need to answer it.`,
        },
        {
          role: "user",
          content: `## Query\n${query}`,
        },
        {
          role: "user",
          content: `## Article\n${chunk}`,
        },
      ],
      maxTokens: 512,
    });

    if (response.success) {
      chunkSummaries.push(response.generatedText);
    }

    // TODO handle failure
  }
  return chunkSummaries;
}
