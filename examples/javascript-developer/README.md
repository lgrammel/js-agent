# JS Agent JavaScript Developer

An automated agent working in a Docker container.

It acts as a JavaScript/TypeScript developer right now, but can be extended to other languages.

## JS Agent features used

- OpenAI chat completion model (`gpt-4`)
- Tool execution separation with executor running in Docker container (to prevent command line actions and file edits from affecting the host machine)
- Agent starts with setup steps (`FixedStepsLoop`)
- `GenerateNextStepLoop` loop with tools and custom prompt

## Usage

```sh
export OPENAI_API_KEY=sk-...

# in root folder:
pnpm install
pnpm nx run-many --target=build
```

Make sure to `cd examples/javascript-developer` before running the following commands:

```sh
mkdir drive

pnpm build
pnpm run-executor

pnpm run-agent `cat examples/helloworld/task.txt` # or any other instruction
```

The `drive` folder contains the shared files between the host and the docker container.

## How to use the js-agent developer for your own project

1. Clone the git repository that the agent should work on into the drive folder, e.g.,
   `git clone https://github.com/lgrammel/js-agent.git drive`

2. Configure the Dockerfile to install any libraries that you need

3. Update agent.mjs with project-specific instructions and setup steps

4. Build & run the docker container

5. Run the agent with a task.
   Put any needed guidance and finish criteria into the task instructions.
   Reference files by their relative path from the workspace root (e.g., "packages/agent/src/index.ts").

## Example tasks

```
Write a unit test for packages/agent/src/action/format/JsonActionFormat. Cover the main path and edge cases to get good coverage.
```

## Example Output

![wikipedia](https://github.com/lgrammel/js-agent/blob/main/examples/javascript-developer/screenshot/autodev-001.png)
