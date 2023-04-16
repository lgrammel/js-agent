import * as $ from "@gptagent/agent";

export async function prioritizeTasks({
  tasks,
  objective,
  generateText,
}: {
  tasks: string[];
  objective: string;
  generateText: $.text.GenerateChatTextFunction;
}) {
  const generatedPrioritizationText = await generateText({
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
