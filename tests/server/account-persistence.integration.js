import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import knex from "knex";
import { prepareDatabaseFromApp } from "@jskit-ai/database-runtime/server/databaseSetup";
import { createKnexMigrationConfigFromApp } from "@jskit-ai/database-runtime/server/knexMigrationConfig";
import { createServer } from "../../server.js";

for (const name of ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "TEST_DB_NAME"]) {
  assert.ok(process.env[name]?.trim(), `${name} must explicitly identify a disposable test database.`);
}
assert.ok(Object.hasOwn(process.env, "DB_PASSWORD"), "DB_PASSWORD must be explicit; an empty password is allowed.");
assert.equal(process.env.DB_NAME, process.env.TEST_DB_NAME, "DB_NAME must match the dedicated TEST_DB_NAME.");
const runtimeEnv = {
  ...process.env,
  AUTH_LOCAL_SESSION_SECRET: "account-persistence-test-only-secret",
  DB_CLIENT: "mysql2",
  HOST: "127.0.0.1",
  NODE_ENV: "test",
  PORT: 3001,
  SERVER_SURFACE: "all"
};

function createSession(app) {
  const cookies = new Map();
  let csrfToken;
  return async function request(method, url, payload, contentType = "application/json") {
    const response = await app.inject({
      method,
      url,
      payload,
      headers: {
        ...(payload ? { "content-type": contentType } : {}),
        cookie: [...cookies].map(([name, value]) => `${name}=${value}`).join("; "),
        ...(csrfToken ? { "x-csrf-token": csrfToken } : {})
      }
    });
    for (const cookie of response.cookies) cookies.set(cookie.name, cookie.value);
    const body = response.body ? response.json() : null;
    if (body?.csrfToken) csrfToken = body.csrfToken;
    return { status: response.statusCode, body };
  };
}

test("account data survives server restart and stays scoped to its owner", async (context) => {
  const preparation = { client: "mysql2", environment: runtimeEnv };
  const database = knex(await createKnexMigrationConfigFromApp(preparation));
  try {
    const [[identity]] = await database.raw("SELECT DATABASE() AS databaseName");
    assert.equal(identity.databaseName, runtimeEnv.TEST_DB_NAME, "The connection must select the dedicated test database.");
  } finally {
    await database.destroy();
  }
  await prepareDatabaseFromApp(preparation);
  const repeated = await prepareDatabaseFromApp(preparation);
  assert.deepEqual(repeated.migrations, [], "Repeated preparation must not rerun migrations.");

  let app = await createServer({ runtimeEnv });
  context.after(() => app?.close());
  let request = createSession(app);
  const email = `migration-${randomUUID()}@example.test`;
  const password = "Migration-test-password-2026!";
  assert.equal((await request("GET", "/api/session")).status, 200);
  const registered = await request("POST", "/api/register", { email, password });
  assert.equal(registered.status, 201, JSON.stringify(registered.body));
  assert.equal((await request("GET", "/api/session")).body.authenticated, true);

  const patched = await request("PATCH", "/api/settings/profile", { data: { type: "user-profiles", attributes: { displayName: "Migration tester" } } }, "application/vnd.api+json");
  assert.equal(patched.status, 200, JSON.stringify(patched.body));
  const settings = await request("GET", "/api/settings");
  assert.equal(settings.status, 200, JSON.stringify(settings.body));
  assert.equal(settings.body.data.attributes.profile.displayName, "Migration tester");

  assert.equal((await request("POST", "/api/logout", {})).status, 200);
  await app.close();
  app = null;
  app = await createServer({ runtimeEnv });
  request = createSession(app);
  assert.equal((await request("GET", "/api/session")).body.authenticated, false);
  assert.equal((await request("GET", "/api/settings")).status, 401);
  const wrongPassword = await request("POST", "/api/login", { email, password: "incorrect-password" });
  assert.equal(wrongPassword.status, 401, JSON.stringify(wrongPassword.body));
  const loggedIn = await request("POST", "/api/login", { email, password });
  assert.equal(loggedIn.status, 200, JSON.stringify(loggedIn.body));
  assert.equal((await request("GET", "/api/settings")).body.data.attributes.profile.displayName, "Migration tester");

  const other = createSession(app);
  await other("GET", "/api/session");
  const otherRegistration = await other("POST", "/api/register", { email: `other-${randomUUID()}@example.test`, password });
  assert.equal(otherRegistration.status, 201, JSON.stringify(otherRegistration.body));
  assert.notEqual((await other("GET", "/api/settings")).body.data.attributes.profile.displayName, "Migration tester");
  assert.equal((await other("PATCH", "/api/settings/profile", { data: { type: "user-profiles", attributes: { displayName: "Second owner" } } }, "application/vnd.api+json")).status, 200);
  assert.equal((await request("GET", "/api/settings")).body.data.attributes.profile.displayName, "Migration tester");
});
