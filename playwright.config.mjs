import { defineConfig } from "@playwright/test";

const managedBaseUrl = String(process.env.PLAYWRIGHT_BASE_URL || "")
  .trim()
  .replace(/\/+$/u, "");
const baseURL = managedBaseUrl || "http://127.0.0.1:4173";
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
        AUTH_LOCAL_SESSION_SECRET: "playwright-only-session-secret",
        DB_CLIENT: "mysql2",
        DB_HOST: process.env.DB_HOST ?? "127.0.0.1",
        DB_PORT: process.env.DB_PORT ?? "3306",
        DB_NAME: process.env.DB_NAME ?? "account_app_browser_test",
        DB_USER: process.env.DB_USER ?? "account_app_browser_test",
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
