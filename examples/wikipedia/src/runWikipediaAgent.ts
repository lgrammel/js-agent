import * as $ from "js-agent";

const openai = $.provider.openai;

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
  const searchWikipediaAction = $.tool.programmableGoogleSearchEngineAction({
    id: "search-wikipedia",
    description:
      "Search wikipedia using a search term. Returns a list of pages.",
    execute: $.tool.executeProgrammableGoogleSearchEngineAction({
      key: wikipediaSearchKey,
      cx: wikipediaSearchCx,
    }),
  });

  const readWikipediaArticleAction = $.tool.extractInformationFromWebpage({
    id: "read-wikipedia-article",
    description:
      "Read a wikipedia article and summarize it considering the query.",
    inputExample: {
      url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
      topic: "{query that you are answering}",
    },
    execute: $.tool.executeExtractInformationFromWebpage({
      extract: $.text.extractRecursively.asExtractFunction({
        split: $.text.splitRecursivelyAtToken.asSplitFunction({
          tokenizer: openai.tokenizer.forModel({
            model: "gpt-3.5-turbo",
          }),
          maxChunkSize: 2048, // needs to fit into a gpt-3.5-turbo prompt and leave room for the answer
        }),
        extract: $.text.generateText.asFunction({
          prompt: $.prompt.extractChatPrompt(),
          model: openai.chatModel({
            apiKey: openAiApiKey,
            model: "gpt-3.5-turbo",
          }),
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
        async ({ runState: { task } }) => [
          {
            role: "system",
            content: `## ROLE
You are an knowledge worker that answers questions using Wikipedia content. You speak perfect JSON.

## CONSTRAINTS
All facts for your answer must be from Wikipedia articles that you have read.

## TASK
${task}`,
          },
        ],
        $.prompt.availableActionsChatPrompt(),
        $.prompt.recentStepsChatPrompt({ maxSteps: 6 })
      ),
      model: openai.chatModel({
        apiKey: openAiApiKey,
        model: "gpt-3.5-turbo",
      }),
    }),
    controller: $.agent.controller.maxSteps(20),
    observer: $.agent.observer.showRunInConsole({ name: "Wikipedia Agent" }),
  });
}
