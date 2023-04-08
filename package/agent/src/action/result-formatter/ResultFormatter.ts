export interface ResultFormatter<INPUT, OUTPUT> {
  formatResult({}: {
    input: INPUT;
    result: { output: OUTPUT; summary: string };
  }): string;
}
