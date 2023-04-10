import { JsonActionFormat } from "./JsonActionFormat";

const jsonActionFormat = new JsonActionFormat();

describe("JsonActionFormat", () => {
  test("format: valid ActionParameters", () => {
    const actionParameters = {
      action: "test-action",
      param1: "value1",
      param2: "value2",
    };
    const formatted = jsonActionFormat.format(actionParameters);
    expect(formatted).toBe(
      '{\n  "action": "test-action",\n  "param1": "value1",\n  "param2": "value2"\n}'
    );
  });

  test("parse: valid JSON string", () => {
    const jsonString =
      '{ "action": "test-action", "param1": "value1", "param2": "value2" }';
    const parsed = jsonActionFormat.parse(jsonString);
    expect(parsed).toEqual({
      action: "test-action",
      param1: "value1",
      param2: "value2",
      _freeText: "",
    });
  });

  test("parse: invalid JSON string", () => {
    const invalidJsonString =
      '{ "action": "test-action", "param1": "value1", "param2": "value2", }';
    expect(() => jsonActionFormat.parse(invalidJsonString)).toThrowError(
      /could not be parsed as JSON/
    );
  });

  test("parse: free text before JSON object", () => {
    const stringWithFreeText =
      'Free text before JSON { "action": "test-action", "param1": "value1", "param2": "value2" }';
    const parsed = jsonActionFormat.parse(stringWithFreeText);
    expect(parsed).toEqual({
      action: "test-action",
      param1: "value1",
      param2: "value2",
      _freeText: "Free text before JSON",
    });
  });
});
