import { createKnexMigrationConfigFromApp } from "@jskit-ai/database-runtime/server/knexMigrationConfig";
import { loadEnvFile } from "./server/lib/envFile.js";

loadEnvFile();

export default await createKnexMigrationConfigFromApp({ client: "mysql2", environment: process.env });
