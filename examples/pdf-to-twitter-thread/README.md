# PDF to Twitter Thread

Takes a PDF and a topic and creates a Twitter thread with all content from the PDF that is relevant to the topic.

## JS Agent features used

- Stand-alone load/extract/rewrite pipeline (no agent)
- PDF loading
- OpenAI chat completion model (`gpt-4`)

## Usage

1. Create .env file with the following content:

```
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

2. Run the following commands:

```sh
# in root folder:
pnpm install
pnpm nx run-many --target=build

# in examples/pdf-summarizer folder:
pnpm start -f my.pdf -t "my topic"
```

## Example output

```bash
❯ pnpm start -f ~/Downloads/parnin_2012_crowd_documentation.pdf -t "android api"

> @js-agent/example-pdf-summarizer@0.0.0 start /Users/lgrammel/repositories/js-agent/examples/pdf-summarizer
> ts-node src/main.ts "-f" "/Users/lgrammel/Downloads/parnin_2012_crowd_documentation.pdf" "-t" "android api"

...extract-information
...extract-information
...extract-information
...extract-information
...extract-information
...extract-information
...extract-information
...extract-information
...extract-information
...extract-information
...extract-information
...extract-information
...extract-information
...extract-information
...extract-information
...extract-information
...rewrite-extracted-information

1/ 🧵 Excited to share our findings on the #AndroidAPI! We analyzed 6,323 questions & 10,638 answers on GWT API, 119,894 questions & 178,084 answers on Android API, and 181,560 questions & 445,934 answers on Java API. Here's what we discovered👇
---
2/ Crowd documentation generates numerous examples & explanations of API elements. While the crowd achieves high coverage, the speed is linear over time. Discussions involve the “crowd” asking questions & a smaller pool of “experts” answering them. #API #AndroidDev
---
3/ For 87% of all Android API classes, at least one thread on Stack Overflow was found. There's a strong correlation between usage data (from Google Code Search) & coverage data (from Stack Overflow) for Android, with a Spearman's rank correlation coefficient of 0.797. 📊
---
4/ Popular packages like android.widget & android.view are well covered, while areas like android.drm (digital rights management) & android.accessibilityservice (accessibility) are largely ignored by the crowd. #AndroidAPI #StackOverflow
---
5/ For all three APIs (Android, Java, and GWT), the rate at which new classes are covered by the crowd follows a linear pattern. API designers can't completely rely on the crowd to provide Q&A for an entire API. Some areas, like accessibility, are ignored. #APIs #AndroidDev
---
6/ Check out the interactive treemap visualization for Android API at http://latest-print.crowd-documentation.appspot.com/?api=android. It helps researchers, API designers, and users understand their community and visualize contributions. #AndroidAPI #DataVisualization 🌐
```
