export function load<SOURCE_PARAMETERS, RAW_FORMAT>({
  from,
  convert,
}: {
  from: (parameters: SOURCE_PARAMETERS) => PromiseLike<RAW_FORMAT>;
  convert: (rawFormat: RAW_FORMAT) => PromiseLike<string>;
}) {
  return async (parameters: SOURCE_PARAMETERS): Promise<string> =>
    convert(await from(parameters));
}
