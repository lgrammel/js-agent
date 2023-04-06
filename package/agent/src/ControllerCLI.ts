import { commandSchema } from "./Command";
import {
  createChatCompletion,
  OpenAIChatMessage,
} from "./createChatCompletion";
import { retryWithExponentialBackoff } from "./retryWithExponentialBackoff";
import { sendCommand } from "./sendCommand";

const prompt = `
You are a software developer that creates and modifies JavaScript programs.
You are working in a Linux environment.
You have access to a GitHub repository (current folder).

You can perform the following actions using JSON syntax:

{ "type": "read-file", "filepath": "{filepath}" }
Read the content of the file {filepath}.

{ "type": "edit-file", "filepath": "{filepath}", "content": "{content}" }
Replace the content of {filepath} with {content}.

{ "type": "run-command", "command": "{command}" }
Run a shell command. The output is shown. Useful commands include:
- ls: list files
- npx: run a command from a package

{ "type": "done" }
Indicate that you are done with the task.

You need to also use one of the above commands with the outlined syntax.
You must use exactly one action per response. 
You must verify that the changes that you make are working.
Explain each action that you perform.

Your task is the following:
`;

async function calculateCompletion(messages: Array<OpenAIChatMessage>) {
  const response = await retryWithExponentialBackoff(() =>
    createChatCompletion({
      apiKey: process.env.OPENAI_API_KEY ?? "",
      messages,
      model: "gpt-4",
      temperature: 0,
      maxTokens: 4096,
    })
  );

  const promptTokenCount = response.usage.prompt_tokens;
  const completionTokenCount = response.usage.completion_tokens;

  printCost(promptTokenCount, completionTokenCount);

  return {
    completion: response.choices[0].message.content,
    promptTokenCount,
    completionTokenCount,
  };
}

async function run({ instructions }: { instructions: string }) {
  console.log("INSTRUCTIONS");
  console.log();
  console.log(instructions);

  const messages: Array<OpenAIChatMessage> = [
    {
      role: "system",
      content: prompt,
    },
    {
      role: "user",
      content: instructions,
    },
  ];

  let counter = 0;
  const maxSteps = 100;
  const startTime = new Date().getTime();

  let totalPromptTokens = 0;
  let totalCompletionTokens = 0;

  while (counter < maxSteps) {
    console.log("========================================");
    console.log("COMPLETION");

    const { completion, promptTokenCount, completionTokenCount } =
      await calculateCompletion(messages);
    totalPromptTokens += promptTokenCount;
    totalCompletionTokens += completionTokenCount;

    console.log();
    console.log(completion);
    messages.push({
      role: "assistant",
      content: completion,
    });

    if (completion.trim().endsWith("}")) {
      try {
        const firstOpeningBraceIndex = completion.indexOf("{");
        const jsonObject = JSON.parse(completion.slice(firstOpeningBraceIndex));

        console.log("========================================");
        console.log("EXECUTE");
        console.log(jsonObject);
        console.log();

        if (jsonObject.type === "done") {
          printCost(totalPromptTokens, totalCompletionTokens);
          const endTime = new Date().getTime();
          const duration = endTime - startTime;
          console.log(`Duration: ${duration} ms`);
          return;
        }

        const command = commandSchema.parse(jsonObject);

        const commandResult = await sendCommand(command);

        console.log(commandResult);
        messages.push({
          role: "user",
          content: JSON.stringify(commandResult),
        });
      } catch (error: any) {
        console.log(error?.message);
        messages.push({
          role: "user",
          content: error?.message,
        });
      }
    }

    counter++;
  }
}

export const runAgent = () => {
  run({
    instructions: process.argv.slice(2).join(" "),
  }).catch((error) => {
    console.error("Error running instructions:", error);
  });
};

function printCost(totalPromptTokens: number, totalCompletionTokens: number) {
  const cost = (
    ((totalPromptTokens * 3) / 1000 + (totalCompletionTokens * 6) / 1000) /
    100
  ).toFixed(2);

  console.log(
    `Prompt tokens: ${totalPromptTokens} Completion tokens:${totalCompletionTokens} Cost: $${cost}`
  );
}
