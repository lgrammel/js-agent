import axios from "axios";

export const webpageAsHtmlText =
  () =>
  async ({ url }: { url: string }): Promise<string> => {
    const result = await axios.get(url);
    return result.data;
  };
