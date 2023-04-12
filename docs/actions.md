# How do actions work?

## Concepts

### [Action](https://github.com/lgrammel/gptagent.js/blob/main/packages/agent/src/action/Action.ts)

Actions are descriptions of operations that the LLM can decide to do. The LLM is informed about the available actions in the prompt, and if they are part of the response, they are parsed.

### [Step](https://github.com/lgrammel/gptagent.js/blob/main/packages/agent/src/step/Step.ts)

The main operation of one iteration of the agent.

### Tool

Tools run code on behalf of the agent. The LLM can decide to use tools by choosing a [ToolAction](https://github.com/lgrammel/gptagent.js/blob/main/packages/agent/src/action/tool/ToolAction.ts) in its response. ToolActions create [ToolSteps](https://github.com/lgrammel/gptagent.js/blob/main/packages/agent/src/action/tool/ToolStep.ts), which run the [ToolExecutor](https://github.com/lgrammel/gptagent.js/blob/main/packages/agent/src/action/tool/ToolExecutor.ts).

## Flow

1. Actions are registered in the [ActionRegistry](https://github.com/lgrammel/gptagent.js/blob/main/packages/agent/src/action/ActionRegistry.ts).
2. Descriptions of the actions are included in the OpenAI prompt by calling actionRegistry.getAvailableActions(), e.g. through the [AvailableActionsSectionPrompt](https://github.com/lgrammel/gptagent.js/blob/main/packages/agent/src/prompt/AvailableActionsSectionPrompt.ts).
3. actionRegistry.getAvailableActionInstructions() generates explanation and a detailed list of all actions using their examples and the formatter being used. For the [JsonActionFormat](https://github.com/lgrammel/gptagent.js/blob/main/packages/agent/src/action/format/JsonActionFormat.ts), that prompt section looks e.g. like tihs:

```
## AVAILABLE ACTIONS
You can perform the following actions using JSON:

### tool.search-wikipedia
Search wikipedia using a search term. Returns a list of pages.
Syntax:
{
  "action": "tool.search-wikipedia",
  "query": "{search query}"
}

### tool.read-wikipedia-article
Read a wikipedia article and summarize it considering the query.
Syntax:
{
  "action": "tool.read-wikipedia-article",
  "url": "https://en.wikipedia.org/wiki/Artificial_intelligence",
  "topic": "{query that you are answering}"
}

### done
Indicate that you are done with the task.
Syntax:
{
  "action": "done"
}

## RESPONSE FORMAT (ALWAYS USE THIS FORMAT)

Explain and describe your reasoning step by step.
Then use the following format to specify the action you want to perform next:

{
  "action": "an action",
  "param1": "a parameter value",
  "param2": "another parameter value"
}

You must always use exactly one action with the correct syntax per response.
Each response must precisely follow the action syntax.
```

4. The LLM response can include an action after the text. It is parsed using the [ActionFormat](https://github.com/lgrammel/gptagent.js/blob/main/packages/agent/src/action/format/ActionFormat.ts) parse method, e.g. in [DynamicCompositeStep.generateNextStep()](https://github.com/lgrammel/gptagent.js/blob/main/packages/agent/src/step/DynamicCompositeStep.ts)
5. The action is then retrieved from the registry and an action step is created (also in DynamicCompositeStep).
6. When the step is executed and it is a [ToolStep](https://github.com/lgrammel/gptagent.js/blob/main/packages/agent/src/action/tool/ToolStep.ts) (which is created by ToolActions), then its executor is invoked.
7. The tool executor runs the actual code.
