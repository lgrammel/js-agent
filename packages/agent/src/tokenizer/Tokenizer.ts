export type Tokenizer = {
  encode: (text: string) => PromiseLike<{
    tokens: Uint32Array;
    texts: Array<string>;
  }>;
  decode: (tokens: Uint32Array) => PromiseLike<string>;
};
