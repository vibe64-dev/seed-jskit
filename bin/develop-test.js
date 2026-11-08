import prepareBrowserDatabases from "../tests/browser/workers.js";

// The Browser test app: the development launcher on a copy of BROWSER_TEST_DB_NAME restored from the schema snapshot,
// as each local browser-test worker's server gets one.
const [environment] = await prepareBrowserDatabases({ workers: 1 });
Object.assign(process.env, { NODE_ENV: "test", ...environment });
await import("./develop.js");
