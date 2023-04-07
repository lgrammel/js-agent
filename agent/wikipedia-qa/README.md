# GPTAgent.js Wikipedia Question-Answering

Answers questions using Wikipedia articles. It searches using a Programmable Search Engine set up for en.wikipedia.org and reads (summarizes) articles to find the answer.

### Requirements

- **GPT-4 access**
- pnpm

## How to run

1. Create a [Programmable Search Engine](https://programmablesearchengine.google.com/about/) for en.wikipedia.org and get the key and cx.

2. Create .env file with the following content:

```
WIKIPEDIA_SEARCH_KEY="YOUR_CUSTOM_SEARCH_KEY"
WIKIPEDIA_SEARCH_CX="YOUR_CUSTOM_SEARCH_CX"
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

```sh
# in root folder:
pnpm install
pnpm nx run-many --target=build

# in agent/wikipedia-qa folder:
pnpm run-agent "which town is bigger, Gummersbach or Bergneustadt?"
```
