# JS Agent BabyAGI

JS Agent implementation of [BabyAGI](https://github.com/yoheinakajima/babyagi) by [@yoheinakajima](https://twitter.com/yoheinakajima).

It is implemented as a single planner step and does not use memory or actions. The main loop that executes the top task from a task list and then updates the task list was extracted into "UpdateTasksLoop".

**⚠️ The BabyAGI implementation is currently being reworked into a server. The documentation is out of date.**

## JS Agent features used

- OpenAI text completion model (`text-davinci-003`)
- Custom console output with AgentRunObserver
- `UpdateTasksLoop` planning loop
- Creating typed LLM functions with prompt and output processor using `$.text.generate`

## Usage

1. Create .env file with the following content:

```
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

2. Build the project:

```sh
# in root folder:
pnpm install
pnpm nx run-many --target=build

# in examples/babyagi folder:
pnpm build
```

3. Start the server:

```sh
pnpm start
```

4. Create an agent run. The response contains the `runId`:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"objective":"solve world hunger"}' http://127.0.0.1:30800/agent/babyagi
{"runId":"bsFcdSuvQQONvG5zxf1G_g-0"}%
```

5. Start the run (with the run id):

```bash
❯ curl -X POST http://127.0.0.1:30800/agent/babyagi/run/bsFcdSuvQQONvG5zxf1G_g-0/start
{"runId":"bsFcdSuvQQONvG5zxf1G_g-0"}%
```

6. Use the run id to access the current run state in the browser.

`http://localhost:30800/agent/babyagi/run/bsFcdSuvQQONvG5zxf1G_g-0`
