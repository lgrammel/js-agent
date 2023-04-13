import { ChatTextGenerator } from "../text-generator/ChatTextGenerator";
import { TextSummarizer } from "./TextSummarizer";

export class ChatTextSummarizer implements TextSummarizer {
  private chatTextGenerator: ChatTextGenerator;

  constructor({ chatTextGenerator }: { chatTextGenerator: ChatTextGenerator }) {
    this.chatTextGenerator = chatTextGenerator;
  }

  async summarizeText({
    text,
    topic,
  }: {
    text: string;
    topic: string;
  }): Promise<string> {
    return this.chatTextGenerator.generateText({
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
  }
}
