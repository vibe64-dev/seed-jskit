import assert from "node:assert/strict";
import test from "node:test";
import { resolveRuntimeEnv } from "../../server/lib/runtimeEnv.js";

// Runs resolveRuntimeEnv with these process environment values, then puts the old ones back.
function resolvedWith(values) {
  const previous = Object.fromEntries(Object.keys(values).map((key) => [key, process.env[key]]));
  try {
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    return resolveRuntimeEnv();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test("production confirms no email address unless AUTH_LOCAL_EMAIL_CONFIRMATION is set", () => {
  assert.equal(
    resolvedWith({ NODE_ENV: "production", AUTH_LOCAL_EMAIL_CONFIRMATION: undefined }).AUTH_LOCAL_EMAIL_CONFIRMATION,
    "false"
  );
  assert.equal(
    resolvedWith({ NODE_ENV: "production", AUTH_LOCAL_EMAIL_CONFIRMATION: "true" }).AUTH_LOCAL_EMAIL_CONFIRMATION,
    "true"
  );
  assert.equal(
    resolvedWith({ NODE_ENV: "development", AUTH_LOCAL_EMAIL_CONFIRMATION: undefined }).AUTH_LOCAL_EMAIL_CONFIRMATION,
    undefined
  );
});
