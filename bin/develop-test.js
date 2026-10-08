import { createKnexMigrationConfigFromApp } from "@jskit-ai/database-runtime/server/knexMigrationConfig";
import { testDatabaseEnvironment } from "../scripts/test-environment.js";
import { prepareBrowserTestDatabase } from "../tests/browser/database.js";

const environment = await testDatabaseEnvironment("BROWSER_TEST_DB_NAME");
const knexConfig = await createKnexMigrationConfigFromApp({ client: "mysql2" });
await prepareBrowserTestDatabase({ knexConfig, seed: async () => {} });
Object.assign(process.env, environment);
await import("./develop.js");
