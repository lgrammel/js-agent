import { Command } from "commander";
import dotenv from "dotenv";
import { summarizePdf } from "./summarizePdf";

dotenv.config();

const program = new Command();

program
  .description("PDF summarizer")
  .requiredOption("-f, --file <value>", "Path to PDF file")
  .requiredOption("-t, --topic <value>", "Topic")
  .parse(process.argv);

const { file, topic } = program.opts();

const openAiApiKey = process.env.OPENAI_API_KEY;

if (!openAiApiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}

summarizePdf({
  topic,
  pdfPath: file,
  openAiApiKey,
  context: {
    recordCall: (call) => {
      console.log(`...${call.metadata.id}`);
    },
  },
})
  .then((result) => {
    console.log();
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
