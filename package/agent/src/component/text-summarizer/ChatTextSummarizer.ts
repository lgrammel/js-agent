import { ChatTextGenerator } from "../text-generator/ChatTextGenerator";
import { TextSummarizer } from "./TextSummarizer";

export class ChatTextSummarizer implements TextSummarizer {
  private chatTextGenerator: ChatTextGenerator;

  constructor({ chatTextGenerator }: { chatTextGenerator: ChatTextGenerator }) {
    this.chatTextGenerator = chatTextGenerator;
  }

  async summarizeText(
    { text, topic }: { text: string; topic: string },
    context: unknown
  ): Promise<string> {
    return this.chatTextGenerator.generateText(
      {
        messages: [
          {
            role: "system",
            content: `## ROLE\nYou are an assistant that summarizes text.\nYou have a specific topic and you want to keep all the information that relates to the topic.`,
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
      },
      context
    );
  }
}
