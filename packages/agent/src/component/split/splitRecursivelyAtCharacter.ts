import { SplitFunction } from "./SplitFunction";

export const splitRecursivelyAtCharacter =
  ({
    maxCharactersPerChunk,
  }: {
    maxCharactersPerChunk: number;
  }): SplitFunction =>
  async ({ text }) =>
    _splitRecursivelyAtCharacter({
      maxCharactersPerChunk,
      text,
    });

function _splitRecursivelyAtCharacter({
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
    ..._splitRecursivelyAtCharacter({ text: left, maxCharactersPerChunk }),
    ..._splitRecursivelyAtCharacter({ text: right, maxCharactersPerChunk }),
  ];
}
