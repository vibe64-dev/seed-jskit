// Settings for server tests. The database is TEST_DB_NAME when set, otherwise
// DB_NAME (a test database prepared with `npm run db:prepare`); the hub
// settings are test-only values.
function hubTestEnv(overrides = {}) {
  return Object.freeze({
    ...process.env,
    DB_CLIENT: "mysql2",
    DB_HOST: process.env.DB_HOST ?? "127.0.0.1",
    DB_PORT: process.env.DB_PORT ?? "3306",
    DB_NAME: process.env.TEST_DB_NAME || process.env.DB_NAME || "accounts_hub_test",
    DB_USER: process.env.DB_USER ?? "accounts_hub_test",
    DB_PASSWORD: process.env.DB_PASSWORD ?? "",
    HOST: "127.0.0.1",
    NODE_ENV: "test",
    PORT: 3001,
    SERVER_SURFACE: "all",
    APP_PUBLIC_URL: "http://localhost:3001",
    OIDC_HUB_SECRET: "test-only-hub-secret-0123456789abcdef0123456789",
    OIDC_HUB_REGISTRATION_TOKEN: "test-only-registration-token-0123456789",
    OIDC_HUB_OWNER_EMAIL: "owner@example.test",
    ...overrides
  });
}

/** Keeps the hub session cookie between injected requests. */
function createInjector(app) {
  let cookie = "";
  return async function request(method, url, body) {
    const response = await app.inject({
      method,
      url,
      headers: { "x-hub-request": "1", ...(cookie ? { cookie } : {}), ...(body ? { "content-type": "application/json" } : {}) },
      ...(body ? { payload: JSON.stringify(body) } : {})
    });
    const setCookie = [response.headers["set-cookie"] || []].flat().find((value) => value.startsWith("hub_session="));
    if (setCookie) cookie = setCookie.split(";")[0];
    return response;
  };
}

export { createInjector, hubTestEnv };
