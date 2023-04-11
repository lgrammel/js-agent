import { Embedding } from "./Embedding";

export interface Memory<T> {
  retrieve({}: { embedding: Embedding; maxResults: number }): Promise<Array<T>>;
  store({}: { embedding: Embedding; item: T }): Promise<void>;
}
