import { GenerateChatTextFunction } from "../generate-text/GenerateChatTextFunction";
import { SummarizeFunction } from "./SummarizeFunction";

export const summarizeByGeneratingSummary =
  ({
    generateText,
  }: {
    generateText: GenerateChatTextFunction;
  }): SummarizeFunction =>
  async ({ text, topic }) =>
    // TODO configurable prompt
    generateText({
      messages: [
        {
          role: "system",
          content: `## ROLE\nYou are an expert at summarizing texts.\nYou need to extract and keep all the information on a specific topic from the text.`,
        },
        {
          role: "user",
          content: `## TOPIC\n${topic}`,
        },
        {
          role: "user",
          content: `## TEXT\n${text}`,
        },
      ],
    });
