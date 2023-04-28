import { SplitFunction } from "./SplitFunction";

export function splitRecursivelyAtCharacter({
  maxCharactersPerChunk,
  text,
}: {
  maxCharactersPerChunk: number;
  text: string;
}): Array<string> {
  if (text.length < maxCharactersPerChunk) {
    return [text];
  }

  const half = Math.ceil(text.length / 2);
  const left = text.substring(0, half);
  const right = text.substring(half);

  return [
    ...splitRecursivelyAtCharacter({ text: left, maxCharactersPerChunk }),
    ...splitRecursivelyAtCharacter({ text: right, maxCharactersPerChunk }),
  ];
}

splitRecursivelyAtCharacter.asSplitFunction =
  ({
    maxCharactersPerChunk,
  }: {
    maxCharactersPerChunk: number;
  }): SplitFunction =>
  async ({ text }: { text: string }) =>
    splitRecursivelyAtCharacter({ maxCharactersPerChunk, text });
