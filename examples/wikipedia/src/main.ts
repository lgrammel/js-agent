import { runWikipediaAgent } from "./runWikipediaAgent";
import dotenv from "dotenv";

dotenv.config();

const wikipediaSearchKey = process.env.WIKIPEDIA_SEARCH_KEY;
const wikipediaSearchCx = process.env.WIKIPEDIA_SEARCH_CX;
const openAiApiKey = process.env.OPENAI_API_KEY;
const objective = process.argv.slice(2).join(" ");

if (!wikipediaSearchKey) {
  throw new Error("WIKIPEDIA_SEARCH_KEY is not set");
}
if (!wikipediaSearchCx) {
  throw new Error("WIKIPEDIA_SEARCH_CX is not set");
}
if (!openAiApiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}

runWikipediaAgent({
  wikipediaSearchCx,
  wikipediaSearchKey,
  openAiApiKey,
  task: objective,
})
  .then(() => {})
  .catch((error) => {
    console.error(error);
  });
