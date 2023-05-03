import { RunContext } from "../agent/RunContext";
import { RetryFunction } from "../util/RetryFunction";
import { retryWithExponentialBackoff } from "../util/retryWithExponentialBackoff";
import { EmbeddingModel } from "./EmbeddingModel";

export async function embed<RAW_OUTPUT, GENERATED_OUTPUT>(
  {
    id,
    model,
    value,
    retry = retryWithExponentialBackoff(),
  }: {
    id?: string;
    model: EmbeddingModel<RAW_OUTPUT, GENERATED_OUTPUT>;
    value: string;
    retry?: RetryFunction;
  },
  context: RunContext
) {
  const startTime = performance.now();
  const startEpochSeconds = Math.floor(
    (performance.timeOrigin + startTime) / 1000
  );

  const rawOutput = await retry(() => model.embed(value));

  const textGenerationDurationInMs = Math.ceil(performance.now() - startTime);

  const metadata = {
    id,
    model: {
      vendor: model.vendor,
      name: model.name,
    },
    startEpochSeconds,
    durationInMs: textGenerationDurationInMs,
    tries: rawOutput.tries,
  };

  if (!rawOutput.success) {
    context?.recordCall?.({
      type: "embed",
      success: false,
      metadata,
      input: value,
      error: rawOutput.error,
    });

    throw rawOutput.error; // TODO wrap error
  }

  const embedding = await model.extractEmbedding(rawOutput.result);

  context?.recordCall?.({
    type: "embed",
    success: true,
    metadata,
    input: value,
    rawOutput: rawOutput.result,
    embedding,
  });

  return embedding;
}

embed.asFunction =
  <RAW_OUTPUT, GENERATED_OUTPUT>({
    id,
    model,
  }: {
    id?: string;
    model: EmbeddingModel<RAW_OUTPUT, GENERATED_OUTPUT>;
  }) =>
  async ({ value }: { value: string }, context: RunContext) =>
    embed({ id, model, value }, context);
