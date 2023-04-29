import * as $ from "js-agent";

export async function createTwitterThreadFromPdf({
  topic,
  pdfPath,
  openAiApiKey,
  context,
}: {
  topic: string;
  pdfPath: string;
  openAiApiKey: string;
  context: $.agent.RunContext;
}) {
  const gpt4 = $.model.openai.chat({
    apiKey: openAiApiKey,
    model: "gpt-4",
  });

  const rewriteAsTwitterThread = $.text.splitExtractRewrite.asExtractFunction({
    split: $.text.splitRecursivelyAtCharacter.asSplitFunction({
      maxChunkSize: 1024 * 4,
    }),
    extract: $.text.generateText.asFunction({
      id: "extract",
      model: gpt4,
      prompt: $.prompt.extractAndExcludeChatPrompt({
        excludeKeyword: "IRRELEVANT",
      }),
    }),
    include: (text) => text !== "IRRELEVANT",
    rewrite: $.text.generateText.asFunction({
      id: "rewrite",
      model: gpt4,
      prompt: async ({ text, topic }) => [
        {
          role: "user" as const,
          content: `## TOPIC\n${topic}`,
        },
        {
          role: "system" as const,
          content: `## TASK
Rewrite the content below into a coherent twitter thread on the topic above.
Include all relevant information about the topic.
Discard all irrelevant information.
Separate each tweet with ---`,
        },
        {
          role: "user" as const,
          content: `## CONTENT\n${text}`,
        },
      ],
    }),
  });

  return rewriteAsTwitterThread(
    {
      text: await $.text.load({
        from: { path: pdfPath },
        using: $.source.fileAsArrayBuffer.asFunction(),
        convert: $.convert.pdfToText.asFunction(),
      }),
      topic,
    },
    context
  );
}
