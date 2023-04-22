# PDF Summarizer

Writes up all content regarding a topic from a PDF.

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
