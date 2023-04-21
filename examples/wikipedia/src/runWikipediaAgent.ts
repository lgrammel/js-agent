import * as $ from "js-agent";

export async function runWikipediaAgent({
  wikipediaSearchKey,
  wikipediaSearchCx,
  openAiApiKey,
  task,
}: {
  openAiApiKey: string;
  wikipediaSearchKey: string;
  wikipediaSearchCx: string;
  task: string;
}) {
  type WikipediaAgentRunProperties = { task: string };

  const chatGpt = $.provider.openai.chatModel({
    apiKey: openAiApiKey,
    model: "gpt-3.5-turbo",
  });

  const searchWikipediaAction =
    $.tool.programmableGoogleSearchEngineAction<WikipediaAgentRunProperties>({
      id: "search-wikipedia",
      description:
        "Search wikipedia using a search term. Returns a list of pages.",
      execute: $.tool.executeProgrammableGoogleSearchEngineAction({
        key: wikipediaSearchKey,
        cx: wikipediaSearchCx,
      }),
    });

  const readWikipediaArticleAction =
    $.tool.summarizeWebpage<WikipediaAgentRunProperties>({
      id: "read-wikipedia-article",
      description:
        "Read a wikipedia article and summarize it considering the query.",
      inputExample: {
        url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
        topic: "{query that you are answering}",
      },
      execute: $.tool.executeSummarizeWebpage({
        extractText: $.text.extractWebpageTextFromHtml(),
        summarize: $.text.summarizeRecursively({
          split: $.text.splitRecursivelyAtCharacter({
            maxCharactersPerChunk: 2048 * 4, // needs to fit into a gpt-3.5-turbo prompt
          }),
          summarize: $.text.generate({
            id: "summarize-wikipedia-article-chunk",
            prompt: $.text.SummarizeChatPrompt,
            model: chatGpt,
            processOutput: async (output) => output.trim(),
          }),
        }),
      }),
    });

  return $.runAgent<{ task: string }>({
    properties: { task },
    agent: $.step.generateNextStepLoop({
      actions: [searchWikipediaAction, readWikipediaArticleAction],
      actionFormat: $.action.format.flexibleJson(),
      prompt: $.prompt.concatChatPrompts(
        async ({ runProperties: { task } }) => [
          {
            role: "system",
            content: `## ROLE
You are an knowledge worker that answers questions using Wikipedia content. You speak perfect JSON.

## CONSTRAINTS
Make sure all facts for your answer are from Wikipedia articles that you have read.`,
          },
          {
            role: "user",
            content: `## TASK\n${task}`,
          },
        ],
        $.prompt.availableActionsChatPrompt(),
        $.prompt.recentStepsChatPrompt({ maxSteps: 6 })
      ),
      model: chatGpt,
    }),
    controller: $.agent.controller.maxSteps(20),
    observer: $.agent.observer.combineObservers(
      $.agent.observer.showRunInConsole({ name: "Wikipedia Agent" }),
      {
        async onRunFinished({ run }) {
          const runCostInMillicent = await $.agent.calculateRunCostInMillicent({
            run,
          });

          console.log(
            `Run cost: $${(runCostInMillicent / 1000 / 100).toFixed(2)}`
          );

          console.log(
            `LLM calls: ${
              run.recordedCalls.filter((call) => call.success).length
            }`
          );
        },
      }
    ),
  });
}
