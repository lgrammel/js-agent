# JS Agent Wikipedia

Answers questions using Wikipedia articles. It searches using a Programmable Search Engine set up for en.wikipedia.org and reads (summarizes) articles to find the answer.

[Full tutorial](https://js-agent.ai/docs/tutorial-wikipedia-agent/)

## JS Agent features used

- OpenAI chat completion model (`gpt-3.5-turbo`)
- Custom tool configuration (`readWikipediaArticleAction`, `searchWikipediaAction`)
- `GenerateNextStepLoop` loop with tools and custom prompt
- `maxSteps` `RunController` to limit the maximum number of steps
- Cost calculation and extracting information from LLM calls after the run

## Usage

1. Create a [Programmable Search Engine](https://programmablesearchengine.google.com/about/) for en.wikipedia.org and get the key and cx.

2. Create .env file with the following content:

```
WIKIPEDIA_SEARCH_KEY="YOUR_CUSTOM_SEARCH_KEY"
WIKIPEDIA_SEARCH_CX="YOUR_CUSTOM_SEARCH_CX"
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

3. Run the following commands:

```sh
# in root folder:
pnpm install
pnpm nx run-many --target=build

# in examples/wikipedia folder:
pnpm start "which town has more inhabitants, Ladysmith or Duncan BC?"
```
