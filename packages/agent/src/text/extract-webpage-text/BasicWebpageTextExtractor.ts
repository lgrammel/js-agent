import axios from "axios";
import { convert } from "html-to-text";
import { ExtractWebpageTextFunction } from "./ExtractWebpageTextFunction";

export const extractWebpageTextFromHtml =
  (): ExtractWebpageTextFunction =>
  async ({ url }: { url: string }): Promise<string> => {
    const result = await axios.get(url);
    const text = convert(result.data);
    return text.replace(/\[.*?\]/g, ""); // remove all links in square brackets
  };
