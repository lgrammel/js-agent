export interface Splitter {
  split({}: { text: string }): PromiseLike<Array<string>>;
}
