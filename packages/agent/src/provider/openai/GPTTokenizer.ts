import GPT3Tokenizer from "gpt3-tokenizer";
import { Tokenizer } from "../../tokenizer/Tokenizer";

export const gptTokenizer = ({
  type = "gpt3",
}: {
  type?: "gpt3" | "codex";
} = {}): Tokenizer => {
  const gptTokenizer = new GPT3Tokenizer({ type });

  return Object.freeze({
    encode: async (text: string) => {
      const encodeResult = gptTokenizer.encode(text);
      return {
        tokens: encodeResult.bpe,
        texts: encodeResult.text,
      };
    },
    decode: async (tokens: Array<number>) => gptTokenizer.decode(tokens),
  });
};
