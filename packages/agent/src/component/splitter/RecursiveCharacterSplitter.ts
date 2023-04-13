import { Splitter } from "./Splitter";

export class RecursiveCharacterSplitter implements Splitter {
  private readonly maxCharactersPerChunk: number;

  constructor({ maxCharactersPerChunk }: { maxCharactersPerChunk: number }) {
    this.maxCharactersPerChunk = maxCharactersPerChunk;
  }

  async split({ text }: { text: string }): Promise<Array<string>> {
    return Promise.resolve(this.splitSync({ text }));
  }

  private splitSync({ text }: { text: string }): Array<string> {
    if (text.length < this.maxCharactersPerChunk) {
      return [text];
    }

    const half = Math.ceil(text.length / 2);
    const left = text.substring(0, half);
    const right = text.substring(half);

    return [
      ...this.splitSync({ text: left }),
      ...this.splitSync({ text: right }),
    ];
  }
}
