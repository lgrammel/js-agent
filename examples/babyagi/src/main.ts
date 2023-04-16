import dotenv from "dotenv";
import { runBabyAGI } from "./runBabyAGI";

dotenv.config();

const openAiApiKey = process.env.OPENAI_API_KEY;
const objective = process.argv.slice(2).join(" ");

if (!openAiApiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}

runBabyAGI({
  openAiApiKey,
  objective,
})
  .then(() => {})
  .catch((error) => {
    console.error(error);
  });
