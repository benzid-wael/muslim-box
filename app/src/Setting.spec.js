import assert from "assert";

import { Setting } from "@src/Setting";

describe("Settings", function () {
  it.each`
    type         | defaultValue | value      | expected
    ${"boolean"} | ${null}      | ${"true"}  | ${true}
    ${"boolean"} | ${null}      | ${"false"} | ${false}
    ${"boolean"} | ${null}      | ${true}    | ${true}
    ${"boolean"} | ${null}      | ${false}   | ${false}
    ${"boolean"} | ${false}     | ${"true"}  | ${true}
    ${"boolean"} | ${false}     | ${null}    | ${false}
  `("After $type setting to: $value, it should returns: $expected", ({ type, defaultValue, value, expected }) => {
    const setting = Setting.build("bool1", type, defaultValue);
    setting.value = value;
    assert.equal(setting.value, expected);
    assert.equal(1, 2);
    a;
  });
});
