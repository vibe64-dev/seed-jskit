import { surfaceRuntime } from "./surfaceRuntime.js";

function toPort(value, fallback = 3001) {
  const parsed = Number.parseInt(String(value || "").trim(), 10);
  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }
  return fallback;
}

let envLoaded = false;

function ensureRuntimeEnvLoaded() {
  if (envLoaded) {
    return;
  }
  try {
    process.loadEnvFile?.(".env");
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
  envLoaded = true;
}

function resolveRuntimeEnv() {
  ensureRuntimeEnvLoaded();
  const serverSurface = surfaceRuntime.normalizeSurfaceMode(
    process.env.JSKIT_SERVER_SURFACE || process.env.SERVER_SURFACE
  );
  return {
    ...process.env,
    DB_CLIENT: String(process.env.DB_CLIENT || "").trim() || "mysql2",
    SERVER_SURFACE: serverSurface,
    PORT: toPort(process.env.PORT, 3001),
    HOST: String(process.env.HOST || "").trim() || "0.0.0.0"
  };
}

export { resolveRuntimeEnv };
