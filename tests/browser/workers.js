import { prepareTestDatabases } from "@jskit-ai/database-runtime/server/testDatabases";
import knexConfig from "../../knexfile.js";

// The browser run's `prepare` module (playwright.config.mjs), run once before the servers start: every Playwright
// worker gets its own copy of BROWSER_TEST_DB_NAME (`<name>`, `<name>_1`, ...), restored from the schema snapshot of
// the current migrations, then seeded. The normal and TEST_DB_NAME databases are refused.

/** The specs register their own accounts; nothing is seeded. */
async function seed() {}

export default async function prepareBrowserDatabases({ workers }) {
  const { databases, summary } = await prepareTestDatabases({
    knexConfig,
    environment: process.env,
    variable: "BROWSER_TEST_DB_NAME",
    count: workers,
    seed
  });
  console.log(`[browser-tests] ${summary}.`);
  return databases.map((database) => ({ DB_NAME: database }));
}
