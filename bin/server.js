import { startServer } from "../server.js";

try {
  await startServer();
} catch (error) {
  console.error("Failed to start accounts hub server:", error);
  process.exitCode = 1;
}
