import fs from "fs/promises";

export const fileAsArrayBuffer = async ({
  path,
}: {
  path: string;
}): Promise<ArrayBuffer> => {
  const rawBuffer = await fs.readFile(path);

  return rawBuffer.buffer.slice(
    rawBuffer.byteOffset,
    rawBuffer.byteOffset + rawBuffer.byteLength
  );
};

fileAsArrayBuffer.asFunction =
  () =>
  async ({ path }: { path: string }) =>
    fileAsArrayBuffer({ path });
