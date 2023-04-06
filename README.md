# GPTAgent.js

An automated agent working in a Docker container. Extensible and written in TypeScript.

It acts as a JavaScript/TypeScript developer right now, but can be extended to other languages.

![autodev-001](https://github.com/lgrammel/autodev/raw/main/screenshot/autodev-001.png)

### Requirements

- **GPT-4 access**
- pnpm
- Docker

## How to run

### Example

(Use an absolute path to set up the shared volume)

```sh
export OPENAI_API_KEY=sk-...

pnpm nx run build-docker-image-arm64
bin/run-docker-container-arm64.sh /Users/lgrammel/repositories/gptagent.js/example/helloworld/volume

npx ts-node src/ControllerCLI.ts `cat example/helloworld/task.txt`
```
