import { ToolAction } from "../action/tool/ToolAction";
import {
  OpenAIChatMessage,
  createChatCompletion,
} from "../ai/openai/createChatCompletion";
import { retryWithExponentialBackoff } from "../util/retryWithExponentialBackoff";
import { Agent } from "./Agent";

function createSystemPrompt({ agent }: { agent: Agent }) {
  return `## ROLE
${agent.role}

## AVAILABLE ACTIONS
${agent.actionRegistry.getAvailableActionInstructions()}

## CONSTRAINTS
${agent.constraints};`;
}

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

async function run({
  agent,
  instructions,
}: {
  agent: Agent;
  instructions: string;
}) {
  console.log("INSTRUCTIONS");
  console.log();
  console.log(instructions);

  const messages: Array<OpenAIChatMessage> = [
    {
      role: "system",
      content: createSystemPrompt({ agent }),
    },
    {
      role: "user",
      content: `## TASK\n${instructions}`,
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

    // console.log(messages);

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

        const actionType = jsonObject.action;
        const action = agent.actionRegistry.getAction(actionType);

        if (action === agent.actionRegistry.doneAction) {
          printCost(totalPromptTokens, totalCompletionTokens);
          const endTime = new Date().getTime();
          const duration = endTime - startTime;
          console.log(`Duration: ${duration} ms`);
          return;
        }

        // TODO introduce tasks
        const toolAction = action as ToolAction<any, any>;

        const executionResult = await toolAction.executor.execute({
          input: jsonObject,
          action: toolAction,
          workspacePath: process.cwd(), // TODO cleanup
        });

        // TODO better formatter for output / result

        console.log(executionResult);
        messages.push({
          role: "user",
          content: JSON.stringify(executionResult),
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

export const runAgent = ({ agent }: { agent: Agent }) => {
  run({
    agent,
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
