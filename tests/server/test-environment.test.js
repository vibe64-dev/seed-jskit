import assert from "node:assert/strict";
import test from "node:test";
import { testDatabaseEnvironment } from "../../scripts/test-environment.js";

test("test launchers reject normal, shared and production databases", async () => {
  const environment = { DB_HOST: "127.0.0.1", DB_PORT: "3306", DB_NAME: "app", DB_USER: "app", DB_PASSWORD: "",
    TEST_DB_NAME: "app_test", BROWSER_TEST_DB_NAME: "app_browser" };
  for (const binding of ["TEST_DB_NAME", "BROWSER_TEST_DB_NAME"]) {
    const isolated = await testDatabaseEnvironment(binding, environment);
    assert.equal(isolated.DB_NAME, environment[binding]);
    assert.equal(isolated.NODE_ENV, "test");
    assert.equal(environment.DB_NAME, "app");
    await assert.rejects(testDatabaseEnvironment(binding, { ...environment, [binding]: "APP" }), /must differ/);
    await assert.rejects(testDatabaseEnvironment(binding, { ...environment, [binding]: "" }), /explicit test database/);
    await assert.rejects(testDatabaseEnvironment(binding, { ...environment, NODE_ENV: "production" }), /production/);
  }
  await assert.rejects(testDatabaseEnvironment("TEST_DB_NAME", { ...environment, TEST_DB_NAME: "app_browser" }), /must differ/);
  const urlEnvironment = { DATABASE_URL: "mysql://app:fixture@127.0.0.1:3306/app", TEST_DB_NAME: "app_test", BROWSER_TEST_DB_NAME: "app_browser" };
  const isolated = await testDatabaseEnvironment("TEST_DB_NAME", urlEnvironment);
  assert.equal(isolated.DB_NAME, "app_test");
  assert.equal(isolated.DB_USER, "app");
  assert.equal(isolated.DATABASE_URL, undefined);
});
