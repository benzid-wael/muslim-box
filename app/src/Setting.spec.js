import assert from "assert"
import forEach from "mocha-each"

import { Setting } from "./Setting"

describe("Settings", function() {
  forEach([
    [Setting.boolean("bool1"), "true", true],
    [Setting.boolean("bool1"), "false", false],
    [Setting.boolean("bool1"), true, true],
    [Setting.boolean("bool1"), false, false],
    [Setting.boolean("bool1", false), "true", true],
    [Setting.boolean("bool1", false), null, false],
  ])
  .it("After setting %s to: %j, it should returns: %j", (setting, value, expected) => {
      setting.value = value;
      assert.equal(setting.value, expected);
  });
});
