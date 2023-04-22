export const rewriteChatPrompt =
  () =>
  async ({ text, topic }: { text: string; topic: string }) =>
    [
      {
        role: "user" as const,
        content: `## TOPIC\n${topic}`,
      },
      {
        role: "system" as const,
        content: `## TASK
Rewrite the content below into a coherent text on the topic above.
Include all relevant information about the topic.
Discard all irrelevant information.
The result can be as long as needed.`,
      },
      {
        role: "user" as const,
        content: `## CONTENT\n${text}`,
      },
    ];
