import * as $ from "@gptagent/agent";

export async function prioritizeTasks({
  tasks,
  objective,
  textGenerator,
}: {
  tasks: string[];
  objective: string;
  textGenerator: $.component.textGenerator.ChatTextGenerator;
}) {
  const generatedPrioritizationText = await textGenerator.generateText({
    messages: [
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
    ],
    maxTokens: 1000,
    temperature: 0.5,
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
