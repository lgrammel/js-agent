import { WebpageTextExtractor } from "./WebpageTextExtractor";
import axios, { AxiosError } from "axios";
import { convert } from "html-to-text";

export class BasicWebpageTextExtractor implements WebpageTextExtractor {
  async extractText({ url }: { url: string }): Promise<string> {
    const result = await axios.get(url);
    const text = convert(result.data);
    return text.replace(/\[.*?\]/g, ""); // remove all links in square brackets
  }
}
