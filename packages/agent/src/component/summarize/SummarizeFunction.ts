export type SummarizeFunction = ({}: {
  text: string;
  topic: string;
}) => PromiseLike<string>;
