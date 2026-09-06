import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "../../server.js";

const runtimeEnv = Object.freeze({
  ...process.env,
  AUTH_LOCAL_SESSION_SECRET: "server-test-only-session-secret",
  DB_CLIENT: "mysql2",
  DB_HOST: process.env.DB_HOST ?? "127.0.0.1",
  DB_PORT: process.env.DB_PORT ?? "3306",
  DB_NAME: process.env.DB_NAME ?? "account_app_server_test",
  DB_USER: process.env.DB_USER ?? "account_app_server_test",
  DB_PASSWORD: process.env.DB_PASSWORD ?? "",
  HOST: "127.0.0.1",
  NODE_ENV: "test",
  PORT: 3001,
  SERVER_SURFACE: "all"
});

test("health and anonymous account session endpoints are available", async (context) => {
  const app = await createServer({ runtimeEnv });
  context.after(() => app.close());

  const healthResponse = await app.inject({
    method: "GET",
    url: "/api/health"
  });
  assert.equal(healthResponse.statusCode, 200);
  assert.deepEqual(healthResponse.json(), {
    ok: true,
    app: "account-app"
  });

  const sessionResponse = await app.inject({
    method: "GET",
    url: "/api/session"
  });
  assert.equal(sessionResponse.statusCode, 200);
  const session = sessionResponse.json();
  assert.equal(session.authenticated, false);
  assert.equal(session.authCapabilities.features.password.login, true);
  assert.equal(session.authCapabilities.features.password.register, true);
  assert.equal(typeof session.csrfToken, "string");
  assert.ok(session.csrfToken.length > 0);
});
