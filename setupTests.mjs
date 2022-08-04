import fs from "fs";
import sqlite3 from "sqlite3";

const setupTestDatabase = async () => {
  const schemaSQL = "./scripts/schema.sql";
  const settingsSQL = "./scripts/settings.sql";
  const db = new sqlite3.Database(":memory:", { verbose: console.log });
  global.testDB = db;
  const schema = fs.readFileSync(schemaSQL, "utf8");
  const settings = fs.readFileSync(settingsSQL, "utf8");
  db.exec(schema);
  db.exec(settings);
};

export const mochaGlobalSetup = async () => {
  await setupTestDatabase();
};
