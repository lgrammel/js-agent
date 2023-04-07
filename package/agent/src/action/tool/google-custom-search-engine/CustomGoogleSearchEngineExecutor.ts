import axios from "axios";
import { Action } from "../../Action.js";
import { ToolExecutor } from "../ToolExecutor.js";
import {
  CustomGoogleSearchEngineInput,
  CustomGoogleSearchEngineOutput,
} from "./CustomGoogleSearchEngineAction.js";

export class GoogleCustomSearchEngineExecutor
  implements
    ToolExecutor<CustomGoogleSearchEngineInput, CustomGoogleSearchEngineOutput>
{
  private readonly key: string;
  private readonly cx: string;
  private readonly results: number;

  constructor({
    key,
    cx,
    results = 5,
  }: {
    key: string;
    cx: string;
    results?: number;
  }) {
    if (key == undefined) {
      throw new Error("Missing Google Custom Search Engine key");
    }
    if (cx == undefined) {
      throw new Error("Missing Google Custom Search Engine cx");
    }
    if (results < 1) {
      throw new Error("Results must be at least 1");
    }

    this.key = key;
    this.cx = cx;
    this.results = results;
  }

  async execute({
    input: { query },
  }: {
    input: CustomGoogleSearchEngineInput;
    action: Action<
      CustomGoogleSearchEngineInput,
      CustomGoogleSearchEngineOutput
    >;
    workspacePath: string;
  }) {
    const result = await axios.get(
      `https://www.googleapis.com/customsearch/v1/siterestrict?key=${this.key}&cx=${this.cx}&q=${query}`
    );

    const items = result.data.items.slice(0, this.results);

    return {
      summary: `Found ${items.length} search results.`,
      output: {
        results: items.map((item: any) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
        })),
      },
    };
  }
}
