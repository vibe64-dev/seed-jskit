import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "../../server.js";
import { resolveRuntimeEnv } from "../../server/lib/runtimeEnv.js";

test("GET /api/health answers while the database answers", async (context) => {
  const app = await createServer({ runtimeEnv: resolveRuntimeEnv() });
  context.after(() => app.close());
  const response = await app.inject({
    method: "GET",
    url: "/api/health"
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), { ok: true, checks: { database: { ok: true } }, app: "myapp" });
});

test("GET /api/health answers 503 while the database cannot be reached", async (context) => {
  const runtimeEnv = { ...resolveRuntimeEnv(), DATABASE_URL: "", DB_HOST: "127.0.0.1", DB_PORT: "9" };
  const app = await createServer({ runtimeEnv });
  context.after(() => app.close());
  const response = await app.inject({
    method: "GET",
    url: "/api/health"
  });

  assert.equal(response.statusCode, 503);
  assert.deepEqual(response.json(), { ok: false, checks: { database: { ok: false } }, app: "myapp" });
});
