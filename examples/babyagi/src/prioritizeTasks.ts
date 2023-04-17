import * as $ from "js-agent";

const prioritizeTasksPrompt: $.prompt.ChatPrompt<{
  tasks: string[];
  objective: string;
}> = async ({ tasks, objective }) => [
  {
    role: "system",
    content: `You are an task prioritization AI tasked with cleaning the formatting of and reprioritizing the following tasks:
${tasks.join(", ")}.
Consider the ultimate objective of your team:${objective}.
Do not remove any tasks. 
Return the result as a numbered list, like:
#. First task
#. Second task
Start the task list with number 1.`,
  },
];

export async function prioritizeTasks({
  tasks,
  objective,
  generateText,
}: {
  tasks: string[];
  objective: string;
  generateText: (messages: $.ai.openai.OpenAIChatMessage[]) => Promise<string>;
}) {
  const generatedPrioritizationText = await $.text.generate({
    prompt: prioritizeTasksPrompt,
    generate: generateText,
  })({
    objective,
    tasks,
  });

  const prioritizedTasksWithNumbers = generatedPrioritizationText
    .trim()
    .split("\n");

  // TODO sort based on numbers (extract numbers first)
  return prioritizedTasksWithNumbers.map((task) => {
    const [idPart, ...rest] = task.trim().split(".");
    return rest.join(".").trim();
  });
}
