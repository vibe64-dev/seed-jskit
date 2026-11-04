import { prepareDatabaseFromApp } from "@jskit-ai/database-runtime/server/databaseSetup";
import { loadEnvFile } from "../server/lib/envFile.js";

loadEnvFile();

await prepareDatabaseFromApp({ client: "mysql2", environment: process.env });
