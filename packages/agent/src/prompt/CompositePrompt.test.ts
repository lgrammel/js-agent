import { CompositePrompt } from "./CompositePrompt";
import { Prompt } from "./Prompt";

describe("CompositePrompt", () => {
  test("generatePrompt combines messages from multiple prompts", async () => {
    const mockPrompt1: Prompt<string> = {
      generatePrompt: async () => [{ role: "system", content: "Message 1" }],
    };
    const mockPrompt2: Prompt<string> = {
      generatePrompt: async () => [{ role: "system", content: "Message 2" }],
    };

    const compositePrompt = new CompositePrompt<string>(
      mockPrompt1,
      mockPrompt2
    );
    const messages = await compositePrompt.generatePrompt("test context");

    expect(messages).toEqual([
      { role: "system", content: "Message 1" },
      { role: "system", content: "Message 2" },
    ]);
  });
});
