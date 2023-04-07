import axios from "axios";
import { convert } from "html-to-text";
import { createChatCompletion } from "../../../ai/openai/createChatCompletion.js";
import { retryWithExponentialBackoff } from "../../../util/retryWithExponentialBackoff.js";
import { Action } from "../../Action.js";
import { ToolExecutor } from "../ToolExecutor.js";
import {
  SummarizeWebsiteInput,
  SummarizeWebsiteOutput,
} from "./SummarizeWebsiteAction.js";

export class SummarizeWebsiteExecutor
  implements ToolExecutor<SummarizeWebsiteInput, SummarizeWebsiteOutput>
{
  async execute({
    input: { topic, url },
  }: {
    input: SummarizeWebsiteInput;
    action: Action<SummarizeWebsiteInput, SummarizeWebsiteOutput>;
    workspacePath: string;
  }) {
    const result = await axios.get(url);

    let text = convert(result.data);

    // remove all links in square brackets
    text = text.replace(/\[.*?\]/g, "");

    // TODO true map reduce that takes chunk summaries and combines them
    const chunks = splitRecursively(text, 4096 * 4);
    const chunkSummaries = await getChunkSummaries(chunks, topic);

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

async function getChunkSummaries(
  chunks: Array<string>,
  query: string
): Promise<Array<string>> {
  const chunkSummaries = [];
  for (const chunk of chunks) {
    const response = await retryWithExponentialBackoff(() =>
      createChatCompletion({
        apiKey: process.env.OPENAI_API_KEY ?? "",
        model: "gpt-4",
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
        temperature: 0,
        maxTokens: 512,
      })
    );

    chunkSummaries.push(response.choices[0].message.content);
  }
  return chunkSummaries;
}
