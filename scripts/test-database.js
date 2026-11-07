import { spawnSync } from "node:child_process";
import { testDatabaseEnvironment } from "./test-environment.js";

const environment = await testDatabaseEnvironment("TEST_DB_NAME");
const result = spawnSync("jskit", ["test", "tests/server/database.integration.js"], {
  env: environment, stdio: "inherit"
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
