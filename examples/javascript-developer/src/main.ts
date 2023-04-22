import dotenv from "dotenv";
import { runDeveloperAgent } from "./runDeveloperAgent";

dotenv.config();

const openAiApiKey = process.env.OPENAI_API_KEY;
const task = process.argv.slice(2).join(" ");

if (!openAiApiKey) {
  throw new Error("OPENAI_API_KEY is not set");
}

// PROJECT INSTRUCTIONS
// Specific to js-agent example. Adjust to fit your own project:
const projectInstructions = `You are working on a JavaScript/TypeScript project called "js-agent".
The project uses pnpm for package management.
The main package is located in the "packages/agent" directory.

Unit tests are written using jest and have a .test.ts ending.
Unit tests are in the same folder as the files that are tested.
When writing tests, first read the production code and then write the tests.
You can run the tests with "ai-bin/test-agent.sh".`;

// PROJECT SPECIFIC SETUP COMMANDS
// These commands are executed at the start of the agent run.
// Specific to js-agent example. Adjust to fit your own project:
const setupCommands = ["pnpm install", "pnpm nx run agent:build"];

runDeveloperAgent({
  openAiApiKey,
  task,
  projectInstructions,
  setupCommands,
})
  .then(() => {})
  .catch((error) => {
    console.error(error);
  });
