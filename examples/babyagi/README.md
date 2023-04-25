# JS Agent BabyAGI (Server)

JS Agent server implementation of [BabyAGI](https://github.com/yoheinakajima/babyagi) by [@yoheinakajima](https://twitter.com/yoheinakajima).

It is implemented as a single planner step and does not use memory or actions. The main loop that executes the top task from a task list and then updates the task list was extracted into "UpdateTasksLoop".

## JS Agent features used

- Agent server with HTTP API
  - expose run as log
  - calculate cost
- OpenAI text completion model (`text-davinci-003`)
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

3. Start the server. It runs on port `30800` by default. You can set the `--host` and `--port` params to change the host and port the server runs on.

```sh
pnpm start
```

4. Create an agent run using a `POST` request to `/agent/babyagi`. The response contains the `runId`:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"objective":"solve world hunger"}' http://127.0.0.1:30800/agent/babyagi
{"runId":"bsFcdSuvQQONvG5zxf1G_g-0"}%
```

5. Use the run id to access the current run state in the browser.

`http://localhost:30800/agent/babyagi/run/bsFcdSuvQQONvG5zxf1G_g-0`

6. Start the run (with the run id):

```bash
❯ curl -X POST http://127.0.0.1:30800/agent/babyagi/run/bsFcdSuvQQONvG5zxf1G_g-0/start
{"runId":"bsFcdSuvQQONvG5zxf1G_g-0"}%
```

7. You can cancel the run with a call to the cancel route (with the run id):

```bash
❯ curl -X POST -H "Content-Type: application/json" -d '{"reason": "need to shut down computer"}' http://127.0.0.1:30800/agent/babyagi/run/bxynsv4USkGoawtCYhte-w-0/cancel
```
