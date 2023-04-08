export interface WebpageTextExtractor {
  extractText({}: { url: string }): PromiseLike<string>;
}
