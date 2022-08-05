import assert from "assert";
import _ from "lodash";

import { Database } from "./Database";

async function assertThrowsAsync(fn, regExp) {
  let f = () => {};
  try {
    await fn();
  } catch (e) {
    f = () => {
      throw e;
    };
  } finally {
    assert.throws(f, regExp);
  }
}

describe("Database", function () {
  it("test settings() returns only active settings", async () => {
    const db = Database.fromDatabase(testDB);
    const settings = await db.settings();
    assert(_.every(settings, "active"));
  });

  it("test getSettingByName() throws Error when settings does not exist", async () => {
    const db = Database.fromDatabase(testDB);
    await assertThrowsAsync(
      async () => {
        await db.getSettingByName("DoesNotExist");
      },
      { name: "Error", message: /^Unrecognized setting:/ }
    );
  });

  it("test getSettingByName() returns setting when exist", async () => {
    const name = "AutoplayAdhan";
    const db = Database.fromDatabase(testDB);
    const setting = await db.getSettingByName(name);
    assert(setting);
    assert.equal(setting.name, name);
  });

  it.each(["true", "false"])("test updateSetting() set value to: %s", async (value) => {
    const name = "AutoplayAdhan";
    const db = Database.fromDatabase(testDB);
    await db.updateSetting(name, value);
    const setting = await db.getSettingByName(name);
    assert.equal(setting.value, value);
  });

  it.each`
    name                       | type
    ${"Method"}                | ${"enum"}
    ${"Madhab"}                | ${"enum"}
    ${"Shafaq"}                | ${"enum"}
    ${"HighLatitudeRule"}      | ${"enum"}
    ${"PolarCircleResolution"} | ${"enum"}
  `("test setting used to compute prayer times: $name", async ({ name, type }) => {
    const db = Database.fromDatabase(testDB);
    const setting = await db.getSettingByName(name);
    assert.equal(setting.name, name);
    assert.equal(setting.type, type);
    assert.equal(setting.active, 1);
  });
});
