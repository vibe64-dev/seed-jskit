import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import test from "node:test";
import { createServer } from "../../server.js";
import { createInjector, hubTestEnv } from "../support/hubEnv.js";

test("an account and its password survive a hub restart", async () => {
  const email = `person-${randomBytes(6).toString("hex")}@example.test`;
  const password = "a persistent passphrase";

  const first = await createServer({ runtimeEnv: hubTestEnv() });
  try {
    const created = await createInjector(first)("POST", "/hub/api/accounts", { email, password, displayName: "Persistent Person" });
    assert.equal(created.statusCode, 200, created.body);
  } finally {
    await first.close();
  }

  const second = await createServer({ runtimeEnv: hubTestEnv() });
  try {
    const request = createInjector(second);
    const signedIn = await request("POST", "/hub/api/sign-in", { email, password });
    assert.equal(signedIn.statusCode, 200, signedIn.body);
    const session = await request("GET", "/hub/api/session");
    assert.equal(session.json().account.email, email);
  } finally {
    await second.close();
  }
});
