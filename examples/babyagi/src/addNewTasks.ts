import * as $ from "js-agent";

const addNewTasksPrompt: $.prompt.ChatPrompt<{
  objective: string;
  completedTask: string;
  completedTaskResult: string;
  existingTasks: string[];
}> = async ({
  objective,
  completedTask,
  completedTaskResult,
  existingTasks,
}) => [
  {
    role: "system" as const,
    content: `You are an task creation AI that uses the result of an execution agent to create new tasks with the following objective: ${objective}.
The last completed task has the result: ${completedTaskResult}.
This result was based on this task description: ${completedTask}.
These are the incomplete tasks: ${existingTasks.join(", ")}. 
Based on the result, create new tasks to be completed by the AI system that do not overlap with incomplete tasks.
Return the tasks as an array.`,
  },
];

export async function addNewTasks({
  objective,
  completedTask,
  completedTaskResult,
  existingTasks,
  generateText,
}: {
  objective: string;
  completedTask: string;
  completedTaskResult: string;
  existingTasks: string[];
  generateText: (messages: $.ai.openai.OpenAIChatMessage[]) => Promise<string>;
}) {
  const generatedNewTasksText = await $.text.generate({
    prompt: addNewTasksPrompt,
    generate: generateText,
  })({
    objective,
    completedTask,
    completedTaskResult,
    existingTasks,
  });

  // TODO introduce output processor pattern
  return existingTasks.concat(generatedNewTasksText.trim().split("\n"));
}
