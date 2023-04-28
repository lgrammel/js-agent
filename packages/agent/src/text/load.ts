export async function load<SOURCE_PARAMETERS, RAW_FORMAT>({
  from,
  using,
  convert,
}: {
  from: SOURCE_PARAMETERS;
  using: (parameters: SOURCE_PARAMETERS) => PromiseLike<RAW_FORMAT>;
  convert: (rawFormat: RAW_FORMAT) => PromiseLike<string>;
}) {
  return convert(await using(from));
}

load.asFunction =
  <SOURCE_PARAMETERS, RAW_FORMAT>({
    using,
    convert,
  }: {
    using: (parameters: SOURCE_PARAMETERS) => PromiseLike<RAW_FORMAT>;
    convert: (rawFormat: RAW_FORMAT) => PromiseLike<string>;
  }) =>
  async (from: SOURCE_PARAMETERS) =>
    load({ from, using, convert });
