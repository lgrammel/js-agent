import {
  get_encoding,
  encoding_for_model,
  TiktokenEncoding,
  Tiktoken,
  TiktokenModel,
} from "@dqbd/tiktoken";
import { Tokenizer } from "../../tokenizer/Tokenizer";

export function tokenizerForModel({
  model,
}: {
  model: TiktokenModel;
}): Tokenizer {
  return tokenizerForTiktokenEncoder({
    encoder: () => encoding_for_model(model),
  });
}

export function tokenizerForEncoding({
  encoding,
}: {
  encoding: TiktokenEncoding;
}): Tokenizer {
  return tokenizerForTiktokenEncoder({ encoder: () => get_encoding(encoding) });
}

export function tokenizerForTiktokenEncoder({
  encoder: createEncoder,
}: {
  encoder: () => Tiktoken;
}): Tokenizer {
  const textDecoder = new TextDecoder();
  return {
    encode: async (text: string) => {
      const encoder = createEncoder();

      try {
        const tokens = encoder.encode(text);

        const tokenTexts: Array<string> = [];
        for (const token of tokens) {
          tokenTexts.push(
            textDecoder.decode(encoder.decode_single_token_bytes(token))
          );
        }

        return {
          tokens,
          texts: tokenTexts,
        };
      } finally {
        encoder.free();
      }
    },

    decode: async (tokens: Uint32Array) => {
      const encoder = createEncoder();
      try {
        return textDecoder.decode(encoder.decode(tokens));
      } finally {
        encoder.free();
      }
    },
  };
}
