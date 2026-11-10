import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { startServer } from "../server.js";

const LOOPBACK_HOST = "127.0.0.1";

function requiredPort(value, fallback = 3001) {
  const normalized = String(value || "").trim();
  const parsed = Number.parseInt(normalized || String(fallback), 10);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65_535) {
    throw new Error(`Invalid development port: ${normalized || "(empty)"}.`);
  }
  return parsed;
}

function waitForChild(child) {
  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => resolve({ code, signal }));
  });
}

const previewHost = String(process.env.HOST || "").trim() || "0.0.0.0";
const previewPort = requiredPort(process.env.PORT);
let apiServer = null;
let viteProcess = null;
let requestedSignal = "";

function requestShutdown(signal) {
  requestedSignal = signal;
  if (viteProcess && !viteProcess.killed) {
    viteProcess.kill(signal);
  }
}

process.once("SIGINT", () => requestShutdown("SIGINT"));
process.once("SIGTERM", () => requestShutdown("SIGTERM"));

// The hub's issuer is the address the browser uses: the development server,
// not the API server behind it. A preview reached through another address
// sets APP_PUBLIC_URL to that address.
process.env.APP_PUBLIC_URL ||= `http://localhost:${previewPort}`;

try {
  apiServer = await startServer({ host: LOOPBACK_HOST, port: 0 });
  const apiPort = requiredPort(apiServer.server.address()?.port);
  // Vite runs directly under node rather than through `npm run dev`: npm exits on SIGTERM without stopping
  // the script it started, which left Vite serving the port after this launcher stopped.
  const vitePackageFile = createRequire(import.meta.url).resolve("vite/package.json");
  const viteCli = path.join(path.dirname(vitePackageFile), JSON.parse(readFileSync(vitePackageFile, "utf8")).bin.vite);
  viteProcess = spawn(
    process.execPath,
    [viteCli, "--host", previewHost, "--port", String(previewPort), "--strictPort"],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        HOST: previewHost,
        PORT: String(previewPort),
        VITE_API_PROXY_TARGET: `http://${LOOPBACK_HOST}:${apiPort}`,
        VITE_DEV_PORT: String(previewPort)
      },
      stdio: "inherit"
    }
  );

  const result = await waitForChild(viteProcess);
  if (!requestedSignal && result.code !== 0) {
    throw new Error(
      `Vite development server stopped unexpectedly (${result.signal || `exit ${result.code ?? "unknown"}`}).`
    );
  }
} catch (error) {
  console.error("Failed to start the development application:", error);
  process.exitCode = 1;
} finally {
  if (apiServer) {
    await apiServer.close().catch(() => {});
  }
}
