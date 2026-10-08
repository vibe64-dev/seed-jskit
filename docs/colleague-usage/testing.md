# Prepare and test the Database app

Choose **Database app** when you need persistence without accounts. Finish
**Prepare workspace** before starting Preview; it installs dependencies and
applies the application's ordinary Knex migrations. Retry preparation on failure.
Database credentials come from Vibe64, not a request to invent an environment.

If feature installation reports incompatible JSKIT packages, ask the coding
agent to match additions to the starter's installed catalogue and retry installation.

The starter has server tests under `tests/server`, client tests under
`tests/client`, and browser tests under `tests/e2e`. The coding agent can extend
them immediately. Application migrations belong in `migrations`; package-owned
migrations are discovered by the existing JSKIT database runtime.

Run server unit tests with `npm test`, limited to `tests/server/*.test.js`.
Launch scripts and database integration tests have separate commands. For one
server file run `node --test --test-concurrency=1 tests/server/smoke.test.js`.
Run client tests
with `npm run test:client`. `npm run test:database` selects the exact `TEST_DB_NAME`
and checks migration idempotence, persistence and rollback. It rejects the normal
and browser databases. Its fixture table is removed even when a check fails.

For browser checks in Vibe64, ask the coding agent to run
`vibe64-helper playwright --target browser-tests test`. The declared **Browser
test app** validates `BROWSER_TEST_DB_NAME`, applies pending migrations, retains
the migration ledger, clears test rows and starts the app. It never drops the
schema. The starter has no required baseline rows; add an explicit fixture seed
in `bin/develop-test.js` when features need them. The amber **Test Preview** bar
identifies this target. Vibe64 restores the previous Preview afterward; a red
recovery notice needs coding-agent recovery before normal use.

Outside Vibe64, provision the three distinct databases and grants named in
`.env.example`, then run `npm ci` and `npm run db:prepare`. `npm run test:e2e`
starts the same isolated test target with your installed Playwright browser.
When supplying `PLAYWRIGHT_BASE_URL`, you own the server and must select the
isolated target before tests that write data. Browser startup reports migration,
fixture reset and seed times. Do not install another browser in managed sessions.

Colleague can explain these steps and offer coding-agent help; a how-to question
alone does not authorize test execution, fixture reset or schema changes.
