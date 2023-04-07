import zod from "zod";
import { ToolAction } from "../ToolAction";
import { ToolExecutor } from "../ToolExecutor";

export type SummarizeWebpageInput = {
  topic: string;
  url: string;
};

export type SummarizeWebpageOutput = {
  summary: string;
};

export class SummarizeWebpageAction extends ToolAction<
  SummarizeWebpageInput,
  SummarizeWebpageOutput
> {
  constructor({
    type = "tool.summarize-website",
    description = "Summarize a webpage considering a topic.",
    inputExample = {
      topic: "{information that I want to extract from the website}",
      url: "{https://www.example.com}",
    },
    executor,
  }: {
    type?: string;
    description?: string;
    inputExample?: SummarizeWebpageInput;
    executor: ToolExecutor<SummarizeWebpageInput, SummarizeWebpageOutput>;
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
