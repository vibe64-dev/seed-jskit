import { prepareTestDatabases } from "@jskit-ai/database-runtime/server/testDatabases";
import knexConfig from "../../knexfile.js";

// The browser run's `prepare` module (playwright.config.mjs), run once before the servers start: every Playwright
// worker gets its own copy of BROWSER_TEST_DB_NAME (`<name>`, `<name>_1`, ...), restored from the schema snapshot of
// the current migrations, and its server's own address as APP_PUBLIC_URL, the hub's issuer. The normal and
// TEST_DB_NAME databases are refused.

/** The specs create the owner and register their apps themselves; nothing is seeded. */
async function seed() {}

export default async function prepareBrowserDatabases({ workers, baseUrls }) {
  const { databases, summary } = await prepareTestDatabases({
    knexConfig,
    environment: process.env,
    variable: "BROWSER_TEST_DB_NAME",
    count: workers,
    seed
  });
  console.log(`[browser-tests] ${summary}.`);
  return databases.map((database, index) => ({ DB_NAME: database, APP_PUBLIC_URL: baseUrls[index] }));
}
