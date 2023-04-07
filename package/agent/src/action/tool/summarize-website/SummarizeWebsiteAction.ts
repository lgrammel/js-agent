import zod from "zod";
import { ToolAction } from "../ToolAction";
import { ToolExecutor } from "../ToolExecutor";

export type SummarizeWebsiteInput = {
  topic: string;
  url: string;
};

export type SummarizeWebsiteOutput = {
  summary: string;
};

export class SummarizeWebsiteAction extends ToolAction<
  SummarizeWebsiteInput,
  SummarizeWebsiteOutput
> {
  constructor({
    type = "tool.summarize-website",
    description = "Summarize a website considering a topic.",
    inputExample = {
      topic: "{information that I want to extract from the article}",
      url: "{https://www.example.com}",
    },
    executor,
  }: {
    type?: string;
    description?: string;
    inputExample?: SummarizeWebsiteInput;
    executor: ToolExecutor<SummarizeWebsiteInput, SummarizeWebsiteOutput>;
  }) {
    super({
      type,
      description,
      inputExample,
      inputSchema: zod.object({
        topic: zod.string(),
        url: zod.string(),
      }),
      outputSchema: zod.object({
        summary: zod.string(),
      }),
      executor,
    });
  }
}
