# GPTAgent.js Wikipedia Question-Answering

Answers questions using Wikipedia articles. It searches using a Programmable Search Engine set up for en.wikipedia.org and reads (summarizes) articles to find the answer.

## Requirements

- **GPT-4 access**
- pnpm

## Usage

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

# in examples/wikipedia-qa folder:
pnpm start "which town is bigger, Gummersbach or Bergneustadt?"
```

## Example Output

![wikipedia-qa](https://github.com/lgrammel/gptagent.js/raw/main/examples/wikipedia-qa/screenshot/wikipedia-qa-001.png)

```sh
> node ./agent.mjs which town is bigger, Gummersbach or Bergneustadt?

### Wikipedia QA ###
which town is bigger, Gummersbach or Bergneustadt?

Thinking…
To find out which town is bigger, I will first search for information on Gummersbach and Bergneustadt on Wikipedia.

Thinking…
{
  "action": "tool.search-wikipedia",
  "query": "Gummersbach"
}

Executing tool.search-wikipedia…
Found 5 search results.

Thinking…
I found the Wikipedia page for Gummersbach. Now, I will read the article to gather information about the town's size.

Thinking…
{
  "action": "tool.read-wikipedia-article",
  "url": "https://en.wikipedia.org/wiki/Gummersbach",
  "topic": "Gummersbach size"
}

Executing tool.read-wikipedia-article…
Summarized website https://en.wikipedia.org/wiki/Gummersbach according to topic Gummersbach size.

Thinking…
Gummersbach is a town in North Rhine-Westphalia, Germany, with a total area of 95.3 square kilometers (36.8 square miles) and a population of 51,126 as of December 31, 2021. Now, I will search for information on Bergneustadt.

Thinking…
{
  "action": "tool.search-wikipedia",
  "query": "Bergneustadt"
}

Executing tool.search-wikipedia…
Found 5 search results.

Thinking…
I found the Wikipedia page for Bergneustadt. Now, I will read the article to gather information about the town's size.

Thinking…
{
  "action": "tool.read-wikipedia-article",
  "url": "https://en.wikipedia.org/wiki/Bergneustadt",
  "topic": "Bergneustadt size"
}

Executing tool.read-wikipedia-article…
Summarized website https://en.wikipedia.org/wiki/Bergneustadt according to topic Bergneustadt size.

Thinking…
Bergneustadt is a municipality in North Rhine-Westphalia, Germany, with a total area of 37.86 km2 (14.62 sq mi) and a population of 18,416 as of December 31, 2021.

Comparing the two towns, Gummersbach has a larger area (95.3 square kilometers) and a higher population (51,126) than Bergneustadt (37.86 square kilometers and 18,416 population). Therefore, Gummersbach is the bigger town.

Thinking…
{
  "action": "done"
}

Done
```
