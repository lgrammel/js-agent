export function createNextId(start: number = 0) {
  let id = start;
  return () => `${id++}`;
}
