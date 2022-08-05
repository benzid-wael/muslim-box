import assert from "assert";
import _ from "lodash";

import { Database } from "./Database";
import * as Repository from "./Repository";
import * as Serializers from "./Serializers";

jest.mock("./Serializers", () => {
  const serializers = jest.requireActual("./Serializers");
  return {
    ...serializers,
    serializeSetting: jest.fn(),
  };
});

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  Serializers.serializeSetting.mockClear();
});

describe("Repository", () => {
  it("test settings() invokes serializeSetting for each of the returned settings", async () => {
    const db = Database.fromDatabase(testDB);
    const result = await Repository.settings(db);
    expect(Serializers.serializeSetting).toHaveBeenCalled();
    expect(Serializers.serializeSetting.mock.calls.length).toBe(result.length);
  });
});
