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

# in example/wikipedia-qa folder:
pnpm run-agent "which town is bigger, Gummersbach or Bergneustadt?"
```

## Example Output

```sh
> node ./agent.mjs "which town is bigger, Gummersbach or Bergneustadt?"

which town is bigger, Gummersbach or Bergneustadt?
========================================

To find out which town is bigger, I will first search for information on Gummersbach and Bergneustadt on Wikipedia.
========================================

{
  "action": "tool.search-wikipedia",
  "query": "Gummersbach"
}
========================================
EXECUTE
{ action: 'tool.search-wikipedia', query: 'Gummersbach' }

{
  summary: 'Found 5 search results.',
  output: { results: [ [Object], [Object], [Object], [Object], [Object] ] }
}
========================================

I found the Wikipedia page for Gummersbach. Now, I will read the article to gather information about the town's size.
========================================

{
  "action": "tool.read-wikipedia-article",
  "url": "https://en.wikipedia.org/wiki/Gummersbach",
  "topic": "Gummersbach size"
}
========================================
EXECUTE
{
  action: 'tool.read-wikipedia-article',
  url: 'https://en.wikipedia.org/wiki/Gummersbach',
  topic: 'Gummersbach size'
}

{
  summary: 'Summarized website https://en.wikipedia.org/wiki/Gummersbach according to topic Gummersbach size.',
  output: {
    summary: 'Gummersbach is a town in North Rhine-Westphalia, Germany, with a total area of 95.3 square kilometers (36.8 square miles) and a population of 51,126 as of December 31, 2021.'
  }
}
========================================

Gummersbach is a town in North Rhine-Westphalia, Germany, with a total area of 95.3 square kilometers (36.8 square miles) and a population of 51,126 as of December 31, 2021. Now, I will search for information on Bergneustadt.
========================================

{
  "action": "tool.search-wikipedia",
  "query": "Bergneustadt"
}
========================================
EXECUTE
{ action: 'tool.search-wikipedia', query: 'Bergneustadt' }

{
  summary: 'Found 5 search results.',
  output: { results: [ [Object], [Object], [Object], [Object], [Object] ] }
}
========================================

I found the Wikipedia page for Bergneustadt. Now, I will read the article to gather information about the town's size.
========================================

{
  "action": "tool.read-wikipedia-article",
  "url": "https://en.wikipedia.org/wiki/Bergneustadt",
  "topic": "Bergneustadt size"
}
========================================
EXECUTE
{
  action: 'tool.read-wikipedia-article',
  url: 'https://en.wikipedia.org/wiki/Bergneustadt',
  topic: 'Bergneustadt size'
}

{
  summary: 'Summarized website https://en.wikipedia.org/wiki/Bergneustadt according to topic Bergneustadt size.',
  output: {
    summary: 'Bergneustadt is a municipality in North Rhine-Westphalia, Germany, with a total area of 37.86 square kilometers (14.62 square miles). As of December 31, 2021, it has a population of 18,416.'
  }
}
========================================

Bergneustadt is a municipality in North Rhine-Westphalia, Germany, with a total area of 37.86 square kilometers (14.62 square miles). As of December 31, 2021, it has a population of 18,416.

Comparing the two towns, Gummersbach is bigger than Bergneustadt in both area and population. Gummersbach has an area of 95.3 square kilometers (36.8 square miles) and a population of 51,126, while Bergneustadt has an area of 37.86 square kilometers (14.62 square miles) and a population of 18,416.
========================================

{
  "action": "done"
}
========================================
EXECUTE
{ action: 'done' }

Prompt tokens: 10049 Completion tokens:419 Cost: $0.33
Duration: 83376 ms
```
