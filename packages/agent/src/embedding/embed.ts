import { RunContext } from "../agent/RunContext";
import { retryWithExponentialBackoff } from "../util/retryWithExponentialBackoff";

export type EmbeddingModel<RAW_OUTPUT, GENERATED_OUTPUT> = {
  vendor: string;
  name: string;
  embed: (value: string) => PromiseLike<RAW_OUTPUT>;
  extractEmbedding: (output: RAW_OUTPUT) => PromiseLike<GENERATED_OUTPUT>;
};

export function embed<RAW_OUTPUT, GENERATED_OUTPUT>({
  id,
  model,
}: {
  id: string;
  model: EmbeddingModel<RAW_OUTPUT, GENERATED_OUTPUT>;
}) {
  return async (value: string, context: RunContext) => {
    const startTime = performance.now();
    const startEpochSeconds = Math.floor(
      (performance.timeOrigin + startTime) / 1000
    );

    const rawOutput = await retryWithExponentialBackoff(() =>
      model.embed(value)
    );

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
  };
}
