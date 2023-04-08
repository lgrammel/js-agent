import { ToolAction } from "../action/tool/ToolAction";
import { RunCommandResultFormatter } from "../action/tool/run-command/RunCommandResultFormatter";
import { OpenAIChatMessage } from "../ai/openai/createChatCompletion";
import { Agent } from "./Agent";

function createSystemPrompt({ agent }: { agent: Agent }) {
  return `## ROLE
${agent.role}

## CONSTRAINTS
${agent.constraints};

## AVAILABLE ACTIONS
${agent.actionRegistry.getAvailableActionInstructions()}`;
}

async function run({
  agent,
  instructions,
}: {
  agent: Agent;
  instructions: string;
}) {
  console.log(instructions);

  const messages: Array<OpenAIChatMessage> = [
    { role: "system", content: createSystemPrompt({ agent }) },
    { role: "user", content: `## TASK\n${instructions}` },
  ];

  let counter = 0;
  const maxSteps = 100;
  const startTime = new Date().getTime();

  while (counter < maxSteps) {
    console.log("========================================");

    const completion = await agent.textGenerator.generateText(
      { messages },
      undefined // TODO context = agent run
    );

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
          context: {
            workspacePath: process.cwd(), // TODO cleanup
          },
        });

        // TODO better formatter for output / result
        let formattedResult = JSON.stringify(executionResult);

        if (toolAction.type === "tool.run-command") {
          formattedResult = new RunCommandResultFormatter().formatResult({
            result: executionResult,
          });
        }

        console.log(formattedResult);

        messages.push({
          role: "system",
          content: formattedResult,
        });
      } catch (error: any) {
        console.log(error?.message);
        messages.push({
          role: "system",
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
