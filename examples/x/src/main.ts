import { runWikipediaAgent } from "./run";
import dotenv from "dotenv";

dotenv.config();

const npmjsSearchKey = process.env.NPMJS_SEARCH_KEY;
const npmjsSearchCx = process.env.NPMJS_SEARCH_CX;
const openAiApiKey = process.env.OPENAI_API_KEY;
const task = process.argv.slice(2).join(" ");

if (!npmjsSearchKey) {
  throw new Error("WIKIPEDIA_SEARCH_KEY is not set");
}
if (!npmjsSearchCx) {
  throw new Error("WIKIPEDIA_SEARCH_CX is not set");
}
if (!openAiApiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}

runWikipediaAgent({
  npmjsSearchCx,
  npmjsSearchKey,
  openAiApiKey,
  task,
})
  .then(() => {})
  .catch((error) => {
    console.error(error);
  });
