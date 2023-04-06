## Autodev

An automated software developing working in a Docker container.

It acts as a JavaScript/TypeScript developer right now, but can be extended to other languages.

## Setup

Only works for Mac (arm64) at the moment. I would appreciate any help to get this to work on Windows or other Mac Models.

### Requirements

- **GPT-4 access**
- pnpm
- Docker

## How to run

### Example:

(Use an absolute path to set up the shared volume)

```sh
export OPENAI_API_KEY=sk-...

pnpm nx run build-docker-image-arm64
bin/run-docker-container-arm64.sh /Users/lgrammel/repositories/autodev/example/helloworld/volume

npx ts-node src/ControllerCLI.ts `cat example/helloworld/task.txt`
```
