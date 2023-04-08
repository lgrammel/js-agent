export function calculateCallCostInMillicent(parameters: {
  model: "gpt-4";
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}) {
  const model = parameters.model;

  switch (model) {
    case "gpt-4": {
      const promptTokenCount = parameters.usage.prompt_tokens;
      const completionTokenCount = parameters.usage.completion_tokens;
      return promptTokenCount * 3 + completionTokenCount * 6; // GPT-4 pricing
    }
    default: {
      const _exhaustiveCheck: never = model;
      throw new Error(`Unknown model: ${model}`);
    }
  }
}
