import * as $ from "js-agent";
import zod from "zod";

export async function runWikipediaAgent({
  npmjsSearchKey,
  npmjsSearchCx,
  openAiApiKey,
  task,
}: {
  openAiApiKey: string;
  npmjsSearchKey: string;
  npmjsSearchCx: string;
  task: string;
}) {
  const chatGpt = $.provider.openai.chatModel({
    apiKey: openAiApiKey,
    model: "gpt-4",
  });

  const searchNpmjsAction = $.tool.programmableGoogleSearchEngineAction({
    id: "search-npmjs",
    description:
      "Search npmjs.com using a search term. Returns a list of pages.",
    execute: $.tool.executeProgrammableGoogleSearchEngineAction({
      key: npmjsSearchKey,
      cx: npmjsSearchCx,
    }),
  });

  return $.runAgent<{ task: string; notes: string }>({
    properties: { task, notes: "" },
    agent: $.step.generateNextStepLoop<
      $.provider.openai.OpenAIChatMessage[],
      {
        task: string;
        notes: string;
      }
    >({
      actions: [
        searchNpmjsAction,
        // $.tool.updateRunStringProperty({
        //   id: "update-notes",
        //   property: "notes",
        //   description: "Update notes. Replaces old notes.",
        //   inputExample: {
        //     content: "Library X does Y. It is different than Z.",
        //   },
        //   formatResult: () => `## Updated notes`,
        // }),
        {
          type: "custom-step",
          id: "research-library",
          description: "Research a single library.",
          inputSchema: zod.object({
            library: zod.string(),
            npmjsUrl: zod.string(),
          }),
          inputExample: {
            library: "react",
            npmjsUrl: "https://www.npmjs.com/package/react",
          },
          outputSchema: zod.object({
            report: zod.string(),
          }),
          createStep: async ({ input: { library, npmjsUrl }, run }) => {
            return new $.step.GenerateNextStepLoop({
              actions: [
                $.tool.extractInformationFromWebpage({
                  id: "read-webpage",
                  description:
                    "Read a webpage and extract information related to the query.",
                  inputExample: {
                    url: "https://www.npmjs.com/package/react",
                    topic: "{library that you are researching}",
                  },
                  execute: $.tool.executeExtractInformationFromWebpage({
                    extract: $.text.extractRecursively({
                      split: $.text.splitRecursivelyAtCharacter({
                        maxCharactersPerChunk: 4096 * 4,
                      }),
                      extract: $.text.generateText({
                        id: "summarize-webpage-chunk",
                        prompt: async ({ text, topic }) => [
                          {
                            role: "user" as const,
                            content: `## TOPIC
Extract features, last published date, weekly downloads, repository link, and documentation link.`,
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
                        ],
                        model: chatGpt,
                      }),
                    }),
                  }),
                }),
              ],
              actionFormat: $.action.format.json(),
              doneAction: $.action.done({
                description:
                  "Indicate that you have researched the library and are done with the task.",
                inputExample: {
                  result:
                    "{report about the library including features, documentation, population, and activity}",
                },
              }),
              prompt: $.prompt.concatChatPrompts(
                async () => [
                  {
                    role: "system",
                    content: `## ROLE
You are a senior software engineer.
You are researching and comparing JavaScript libraries.
Consider their features, documentation, population, and activity.

## CONSTRAINTS
Your memory is very limited - always update your notes.
All facts for your answer must be from web pages that you have read.

## TASK
Research the library ${library}.
Library page on npm.js: ${npmjsUrl}`,
                  },
                ],
                $.prompt.availableActionsChatPrompt(),
                $.prompt.recentStepsChatPrompt({ maxSteps: 6 })
              ),
              model: chatGpt,
              run,
            });
          },
        },
      ],
      actionFormat: $.action.format.json(),
      prompt: $.prompt.concatChatPrompts(
        async ({ runState: { task } }) => [
          {
            role: "system",
            content: `## ROLE
You are a senior software engineer.
You are researching and comparing JavaScript libraries.
Consider their features, documentation, population, and activity.

## CONSTRAINTS
All facts for your answer must be from web pages that you have read.

## TASK
${task}`,
          },
        ],
        //         async ({ runState: { notes } }) => [
        //           {
        //             role: "system",
        //             content: `## NOTES
        // ${notes ?? "(empty)"}`,
        //           },
        //         ],
        $.prompt.availableActionsChatPrompt(),
        $.prompt.recentStepsChatPrompt({ maxSteps: 6 })
      ),
      model: chatGpt,
    }),
    controller: $.agent.controller.maxSteps(20),
    observer: $.agent.observer.showRunInConsole({ name: "X" }),
  });
}
