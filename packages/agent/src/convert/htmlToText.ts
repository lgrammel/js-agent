import { convert } from "html-to-text";

export const htmlToText = (content: string) => {
  const text = convert(content);
  return text.replace(/\[.*?\]/g, ""); // remove all links in square brackets
};

htmlToText.asFunction = () => async (content: string) => htmlToText(content);
