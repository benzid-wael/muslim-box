import assert from "assert";

import { validate } from "./Settings";

describe("Settings", () => {
  it.each`
    type         | value      | options
    ${"boolean"} | ${"true"}  | ${null}
    ${"boolean"} | ${"false"} | ${null}
    ${"int"}     | ${"122"}   | ${null}
    ${"int"}     | ${"0"}     | ${null}
    ${"int"}     | ${"34"}    | ${null}
    ${"string"}  | ${"hello"} | ${null}
    ${"string"}  | ${""}      | ${null}
    ${"string"}  | ${"   "}   | ${null}
    ${"string"}  | ${"34"}    | ${null}
    ${"enum"}    | ${"hello"} | ${{ options: ["hello", "world"] }}
  `("test validate accept valid input for setting: $type", ({ type, value, options }) => {
    const setting = { type, options };
    assert(validate(setting, value));
  });

  it.each`
    type         | value       | options
    ${"boolean"} | ${true}     | ${null}
    ${"boolean"} | ${false}    | ${null}
    ${"boolean"} | ${"some"}   | ${null}
    ${"int"}     | ${"-1"}     | ${null}
    ${"int"}     | ${"0.5"}    | ${null}
    ${"int"}     | ${"some"}   | ${null}
    ${"string"}  | ${233}      | ${null}
    ${"enum"}    | ${"hello1"} | ${null}
    ${"enum"}    | ${"hello1"} | ${{ options: ["hello", "world"] }}
  `("test validate throws error for invalid input, type: $type, input: $value", ({ type, value, options }) => {
    const setting = { type, options };
    assert.throws(() => validate(setting, value), {
      name: "Error",
    });
  });
});
