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
  static readonly TYPE = "tool.summarize-website";

  static readonly OUTPUT_SCHEMA = zod.object({
    summary: zod.string(),
  });

  constructor({
    type = SummarizeWebpageAction.TYPE,
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
      outputSchema: SummarizeWebpageAction.OUTPUT_SCHEMA,
      executor,
    });
  }
}
