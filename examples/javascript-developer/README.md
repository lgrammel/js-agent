# JS Agent JavaScript Developer

An automated developer agent that works in a docker container. It can read files, write files and execute commands. You can adjust it for your project and use it to document code, write tests, update tests and features, etc.

## JS Agent features used

- OpenAI chat completion model (`gpt-4`)
- Tool execution separation with executor running in Docker container (to prevent command line actions and file edits from affecting the host machine)
- Agent starts with setup steps (`FixedStepsLoop`)
- Multiple agent run properties
- `GenerateNextStepLoop` loop with tools (read file, write file, run, command, ask user) and custom prompt

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

## How to use the JS Agent developer in your own project

1. Clone the git repository that the agent should work on into the drive folder, e.g.,
   `git clone https://github.com/lgrammel/js-agent.git drive`

2. Configure the Dockerfile to install any libraries that you need for your project.
   There are existing examples for JS-Agent in the the Dockerfile.

3. Update ` src/main.ts` with project-specific instructions and setup command.
   There are existing examples for JS-Agent in the the `src/main.ts` file.

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
