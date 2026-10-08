import assert from "node:assert/strict";
import test from "node:test";
import knex from "knex";
import { createKnexMigrationConfigFromApp } from "@jskit-ai/database-runtime/server/knexMigrationConfig";
import { prepareDatabaseFromApp } from "@jskit-ai/database-runtime/server/databaseSetup";

test("isolated migrations are repeatable and transactions roll back", async () => {
  assert.ok(process.env.TEST_DB_NAME);
  assert.equal(process.env.DB_NAME, process.env.TEST_DB_NAME);
  const options = { client: "mysql2" };
  const db = knex(await createKnexMigrationConfigFromApp(options));
  try {
    const [[identity]] = await db.raw("SELECT DATABASE() AS name");
    assert.equal(identity.name, process.env.TEST_DB_NAME);
    await prepareDatabaseFromApp(options);
    assert.deepEqual((await prepareDatabaseFromApp(options)).migrations, []);
    const fixture = `starter_test_${process.pid}`;
    await db.schema.createTable(fixture, table => { table.increments("id"); table.string("value").notNullable(); });
    try {
      await db.transaction(trx => trx(fixture).insert({ value: "saved" }));
      assert.equal((await db(fixture).first()).value, "saved");
      await assert.rejects(db.transaction(async trx => {
        await trx(fixture).insert({ value: "rolled back" });
        throw new Error("rollback fixture");
      }), /rollback fixture/);
      assert.equal((await db(fixture)).length, 1);
    } finally { await db.schema.dropTable(fixture); }
  } finally { await db.destroy(); }
});
