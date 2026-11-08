# Test the application

Application tests are ready before the first feature.
`npm test` discovers only `tests/server/*.test.js`; launch scripts and the
isolated database integration suite have separate commands.

## Sources

- `package.json`
- `knexfile.js`
- `scripts/prepare-database.js`
- Main: `playwright.config.mjs`
- `tests/browser/workers.js`
- `bin/develop-test.js`
- `tests/server/database.integration.js`
- `docs/colleague-usage/testing.md`

## Public contract

Preparation installs the locked JSKIT packages, release catalogue and matching
agent documentation together. Agent instructions select those local guides and
complete patterns; ordinary preparation does not select a newer release.
The locked starter also includes `crud-core`, `resource-crud-core`, and
`http-web`, ready for database feature implementation without another install.

Workspace setup installs the locked dependencies and runs ordinary JSKIT
migration preparation. Test databases come from JSKIT's harness
(`@jskit-ai/database-runtime/server/testDatabases`): `npm run test:database`
runs `jskit test --databases`, which gives each integration file a copy of
`TEST_DB_NAME` restored from a schema snapshot, and the browser run's
`tests/browser/workers.js` gives each server a copy of `BROWSER_TEST_DB_NAME`.
Both refuse the normal database, each other's databases and production mode;
the migrations are replayed only when one changes. Standalone Playwright
(`browserTestConfig()` from `@jskit-ai/jskit-catalog/browser-tests`) builds the
production frontend once and starts one server and database per worker. The
declared browser-tests target (`develop:test`) runs the development launcher on
its own restored copy, advertises test data and uses the host's assigned
address. Managed Playwright uses the supplied Preview.
