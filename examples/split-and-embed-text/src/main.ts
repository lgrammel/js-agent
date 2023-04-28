import { Command } from "commander";
import dotenv from "dotenv";
import { splitAndEmbedText } from "./splitAndEmbedText";

dotenv.config();

const program = new Command();

program
  .description("PDF summarizer")
  .requiredOption("-f, --file <value>", "Path to text file")
  .parse(process.argv);

const { file } = program.opts();

const openAiApiKey = process.env.OPENAI_API_KEY;

if (!openAiApiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}

splitAndEmbedText({
  textFilePath: file,
  openAiApiKey,
})
  .then((result) => {})
  .catch((error) => {
    console.error(error);
  });
