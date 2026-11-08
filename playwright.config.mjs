import { defineConfig } from "@playwright/test";
import { browserTestConfig } from "@jskit-ai/jskit-catalog/browser-tests";

// The browser tests register apps and name the owner with the same values the servers use.
process.env.OIDC_HUB_REGISTRATION_TOKEN ||= "playwright-only-registration-token-0123";
process.env.OIDC_HUB_OWNER_EMAIL ||= "owner@example.test";
const managed = Boolean(String(process.env.PLAYWRIGHT_BASE_URL || "").trim());

// Each Playwright worker gets its own server on the production build and its own copy of BROWSER_TEST_DB_NAME, with
// the server's own address as APP_PUBLIC_URL (tests/browser/workers.js); with PLAYWRIGHT_BASE_URL, the managed target.
const config = browserTestConfig({
  testDir: "./tests/e2e",
  prepare: "tests/browser/workers.js",
  env: {
    OIDC_HUB_SECRET: "playwright-only-hub-secret-0123456789abcdef0123",
    OIDC_HUB_REGISTRATION_TOKEN: process.env.OIDC_HUB_REGISTRATION_TOKEN,
    OIDC_HUB_OWNER_EMAIL: process.env.OIDC_HUB_OWNER_EMAIL,
    DB_CLIENT: "mysql2",
    NODE_ENV: "test"
  }
});

export default defineConfig({
  ...config,
  // A managed target's development server compiles each page on its first visit.
  expect: { ...config.expect, timeout: managed ? 30_000 : config.expect.timeout }
});
