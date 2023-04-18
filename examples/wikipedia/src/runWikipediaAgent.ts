import * as $ from "js-agent";

export async function runWikipediaAgent({
  wikipediaSearchKey,
  wikipediaSearchCx,
  openAiApiKey,
  objective,
}: {
  openAiApiKey: string;
  wikipediaSearchKey: string;
  wikipediaSearchCx: string;
  objective: string;
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

  const readWikipediaArticleAction = $.tool.summarizeWebpage({
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
          // maxCharactersPerChunk can be increased to 4096 * 4 when you use gpt-4:
          maxCharactersPerChunk: 2048 * 4,
        }),
        summarize: $.text.generate({
          prompt: $.text.SummarizeChatPrompt,
          generate: $.provider.openai.generateChatText({
            apiKey: openAiApiKey,
            model: "gpt-3.5-turbo",
          }),
          processOutput: async (output) => output.trim(),
        }),
      }),
    }),
  });

  return $.runAgent({
    agent: $.step.createGenerateNextStepLoop({
      actionRegistry: new $.action.ActionRegistry({
        actions: [searchWikipediaAction, readWikipediaArticleAction],
        format: new $.action.format.JsonActionFormat(),
      }),
      prompt: $.prompt.concatChatPrompts<$.step.GenerateNextStepLoopContext>(
        $.prompt.sectionsChatPrompt({
          role: "system",
          getSections: async () => [
            {
              title: "Role",
              // "You speak perfect JSON" helps getting gpt-3.5-turbo to provide structured json at the end
              content: `You are an knowledge worker that answers questions using Wikipedia content. You speak perfect JSON.`,
            },
            {
              title: "Constraints",
              content: `Make sure all facts for your answer are from Wikipedia articles that you have read.`,
            },
          ],
        }),
        $.prompt.taskChatPrompt(),
        $.prompt.availableActionsChatPrompt(),
        $.prompt.recentStepsChatPrompt({ maxSteps: 6 })
      ),
      generate: $.provider.openai.generateChatText({
        apiKey: openAiApiKey,
        model: "gpt-3.5-turbo",
      }),
    }),
    observer: $.agent.outputAgentRunOnConsole({
      name: "Wikipedia Agent",
    }),
    objective,
  });
}
