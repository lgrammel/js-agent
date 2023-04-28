export type EmbeddingModel<RAW_OUTPUT, GENERATED_OUTPUT> = {
  vendor: string;
  name: string;
  embed: (value: string) => PromiseLike<RAW_OUTPUT>;
  extractEmbedding: (output: RAW_OUTPUT) => PromiseLike<GENERATED_OUTPUT>;
};
