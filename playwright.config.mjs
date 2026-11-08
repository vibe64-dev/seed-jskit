import { defineConfig } from "@playwright/test";
import { browserTestConfig } from "@jskit-ai/jskit-catalog/browser-tests";

// Each Playwright worker gets its own server on the production build and its own copy of BROWSER_TEST_DB_NAME
// (tests/browser/workers.js); with PLAYWRIGHT_BASE_URL, the managed target.
export default defineConfig(browserTestConfig({ testDir: "./tests/e2e", prepare: "tests/browser/workers.js" }));
