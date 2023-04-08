# GPTAgent.js JavaScript Developer

An automated agent working in a Docker container.

It acts as a JavaScript/TypeScript developer right now, but can be extended to other languages.

## Requirements

- **GPT-4 access**
- pnpm
- Docker

## Usage

```sh
export OPENAI_API_KEY=sk-...

# in root folder:
pnpm install
pnpm nx run-many --target=build

# in example/javascript-developer folder:
mkdir drive

pnpm build
pnpm run-executor

pnpm run-agent `cat example/helloworld/task.txt` # or any other instruction
```

The `drive` folder contains the shared files between the host and the docker container.

### Tips & Tricks

Clone the git repository that the agent should work on into the drive folder:

```sh
git clone https://github.com/lgrammel/gptagent.js.git drive
```

## Example Output

![autodev-001](https://github.com/lgrammel/gptagent.js/raw/main/example/javascript-developer/screenshot/autodev-001.png)
