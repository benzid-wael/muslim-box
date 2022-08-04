import assert from "assert";
import forEach from "mocha-each";
import _ from "lodash";

import { Database } from "./Database";

describe("Database", function () {
  it("test settings() returns only active settings", async () => {
    const db = Database.fromDatabase(testDB);
    const settings = await db.settings();
    assert(_.every(settings, "active"));
  });
});
