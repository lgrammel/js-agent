export type Tokenizer = {
  encode: (text: string) => PromiseLike<{
    tokens: Array<number>;
    texts: Array<string>;
  }>;
  decode: (tokens: Array<number>) => PromiseLike<string>;
};
