import { createNextId } from "./createNextId";

test("createNextId generates sequential IDs", () => {
  const nextId = createNextId();
  expect(nextId()).toBe("0");
  expect(nextId()).toBe("1");
  expect(nextId()).toBe("2");
});

test("createNextId starts from the given start value", () => {
  const nextId = createNextId(5);
  expect(nextId()).toBe("5");
  expect(nextId()).toBe("6");
  expect(nextId()).toBe("7");
});

test("createNextId handles large start values", () => {
  const nextId = createNextId(Number.MAX_SAFE_INTEGER - 2);
  expect(nextId()).toBe(`${Number.MAX_SAFE_INTEGER - 2}`);
  expect(nextId()).toBe(`${Number.MAX_SAFE_INTEGER - 1}`);
  expect(nextId()).toBe(`${Number.MAX_SAFE_INTEGER}`);
});
