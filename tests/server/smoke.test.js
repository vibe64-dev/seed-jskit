import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "../../server.js";
import { hubTestEnv } from "../support/hubEnv.js";

test("health, discovery and the anonymous hub session are available", async (context) => {
  const app = await createServer({ runtimeEnv: hubTestEnv() });
  context.after(() => app.close());

  const health = await app.inject({ method: "GET", url: "/api/health" });
  assert.equal(health.statusCode, 200);
  assert.deepEqual(health.json(), { ok: true, app: "accounts-hub" });

  const discovery = await app.inject({ method: "GET", url: "/.well-known/openid-configuration" });
  assert.equal(discovery.statusCode, 200);
  assert.equal(discovery.json().issuer, "http://localhost:3001");
  assert.equal(discovery.json().registration_endpoint, "http://localhost:3001/oidc/reg");

  const session = await app.inject({ method: "GET", url: "/hub/api/session" });
  assert.equal(session.statusCode, 200);
  assert.equal(session.json().account, null);
});

test("the app's hub calls need the hub's request header and apps need PKCE", async (context) => {
  const app = await createServer({ runtimeEnv: hubTestEnv() });
  context.after(() => app.close());

  const withoutHeader = await app.inject({
    method: "POST",
    url: "/hub/api/sign-in",
    headers: { "content-type": "application/json" },
    payload: JSON.stringify({ email: "owner@example.test", password: "whatever-it-is" })
  });
  assert.equal(withoutHeader.statusCode, 403);

  const registration = await app.inject({
    method: "POST",
    url: "/oidc/reg",
    headers: { authorization: "Bearer test-only-registration-token-0123456789", "content-type": "application/json" },
    payload: JSON.stringify({ client_name: "Smoke", redirect_uris: ["http://127.0.0.1:4999/auth/callback"] })
  });
  assert.equal(registration.statusCode, 201);
  assert.equal(registration.headers["x-hub-client-status"], "active-dev");
  const client = registration.json();
  try {
    const query = new URLSearchParams({ client_id: client.client_id, redirect_uri: client.redirect_uris[0], response_type: "code", scope: "openid" });
    const withoutPkce = await app.inject({ method: "GET", url: `/oidc/auth?${query}` });
    assert.equal(withoutPkce.statusCode, 303);
    assert.match(withoutPkce.headers.location, /error=invalid_request/u);
  } finally {
    await app.inject({
      method: "DELETE",
      url: `/oidc/reg/${client.client_id}`,
      headers: { authorization: `Bearer ${client.registration_access_token}` }
    });
  }
});

test("a hub missing its owner email stops with a sentence naming the variable", async () => {
  await assert.rejects(
    createServer({ runtimeEnv: hubTestEnv({ OIDC_HUB_OWNER_EMAIL: "" }) }),
    /OIDC_HUB_OWNER_EMAIL/u
  );
});
