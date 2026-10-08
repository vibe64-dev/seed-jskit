import { createKnexMigrationConfigFromApp } from "@jskit-ai/database-runtime/server/knexMigrationConfig";

try { process.loadEnvFile?.(".env"); }
catch (error) { if (error.code !== "ENOENT") throw error; }

async function testDatabaseEnvironment(binding, environment = process.env) {
  if (environment.NODE_ENV === "production") throw new Error("Tests cannot use a production runtime.");
  const config = await createKnexMigrationConfigFromApp({ client: "mysql2", environment });
  const target = String(environment[binding] || "").trim();
  if (!/^[a-zA-Z0-9_]{1,64}$/.test(target)) throw new Error(`${binding} must name an explicit test database.`);
  const other = binding === "TEST_DB_NAME" ? environment.BROWSER_TEST_DB_NAME : environment.TEST_DB_NAME;
  if ([config.connection.database, other].some(name => String(name || "").toLowerCase() === target.toLowerCase())) {
    throw new Error(`${binding} must differ from the normal and other test databases.`);
  }
  const testEnvironment = {
    ...environment, NODE_ENV: "test", DB_CLIENT: "mysql2", DB_NAME: target,
    DB_HOST: config.connection.host, DB_PORT: String(config.connection.port),
    DB_USER: config.connection.user, DB_PASSWORD: config.connection.password
  };
  delete testEnvironment.DATABASE_URL;
  return testEnvironment;
}

export { testDatabaseEnvironment };
