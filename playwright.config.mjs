import { defineConfig } from "@playwright/test";

const managedBaseUrl = String(process.env.PLAYWRIGHT_BASE_URL || "")
  .trim()
  .replace(/\/+$/u, "");
const baseURL = managedBaseUrl || "http://127.0.0.1:4173";
// The browser tests register apps and name the owner with the same values the server uses.
process.env.OIDC_HUB_REGISTRATION_TOKEN ||= "playwright-only-registration-token-0123";
process.env.OIDC_HUB_OWNER_EMAIL ||= "owner@example.test";
const storageState = String(process.env.VIBE64_PLAYWRIGHT_STORAGE_STATE || "").trim();

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  use: {
    baseURL,
    headless: true,
    ...(storageState ? { storageState } : {})
  },
  ...(managedBaseUrl ? {} : {
    webServer: {
      command: "npm run build && node ./bin/server.js",
      env: {
        APP_PUBLIC_URL: baseURL,
        OIDC_HUB_SECRET: "playwright-only-hub-secret-0123456789abcdef0123",
        OIDC_HUB_REGISTRATION_TOKEN: process.env.OIDC_HUB_REGISTRATION_TOKEN,
        OIDC_HUB_OWNER_EMAIL: process.env.OIDC_HUB_OWNER_EMAIL,
        DB_CLIENT: "mysql2",
        DB_HOST: process.env.DB_HOST ?? "127.0.0.1",
        DB_PORT: process.env.DB_PORT ?? "3306",
        DB_NAME: process.env.DB_NAME ?? "accounts_hub_browser_test",
        DB_USER: process.env.DB_USER ?? "accounts_hub_browser_test",
        DB_PASSWORD: process.env.DB_PASSWORD ?? "",
        NODE_ENV: "test",
        PORT: "4173"
      },
      url: `${baseURL}/api/health`,
      reuseExistingServer: true,
      timeout: 180_000
    }
  })
});
