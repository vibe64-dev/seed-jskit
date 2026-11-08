# Prepare and test the Database app

Choose **Database app** when you need persistence without accounts. Finish
**Prepare workspace** before starting Preview; it installs dependencies and
applies the application's ordinary Knex migrations. Retry preparation on failure.
Database credentials come from Vibe64, not a request to invent an environment.

Preparation also installs the standard JSKIT CRUD server, resource and web-screen
libraries. The coding agent can add database-backed forms and lists through their
existing APIs without another library-installation step. Product fields, access
rules, routes and migrations remain application decisions.

The starter has server tests under `tests/server`, client tests under
`tests/client`, and browser tests under `tests/e2e`. The coding agent can extend
them immediately. Application migrations belong in `migrations`; package-owned
migrations are discovered by the existing JSKIT database runtime.

Run server unit tests with `npm test`, limited to `tests/server/*.test.js`.
`jskit test` runs the files in parallel, as many at a time as the machine's test
budget allows. Launch scripts and database integration tests have separate
commands. For one server file run `npx jskit test tests/server/smoke.test.js`.
Run client tests
with `npm run test:client`. `npm run test:database` runs the integration file
with `jskit test --databases`: it gets its own copy of `TEST_DB_NAME`, restored
from a snapshot of the migrations' schema, and checks migration idempotence,
persistence and rollback. The normal and browser databases are refused. Its
fixture table is removed even when a check fails.

For browser checks in Vibe64, ask the coding agent to run
`vibe64-helper playwright --target browser-tests test`. The declared **Browser
test app** restores `BROWSER_TEST_DB_NAME` from the stored snapshot of the
migrations' schema, so no test rows survive, and starts the app; the
migrations are replayed only when one changes. The starter has no required
baseline rows; add a fixture `seed` in `tests/browser/workers.js` when features
need them. The amber **Test Preview** bar
identifies this target. Vibe64 restores the previous Preview afterward; a red
recovery notice needs coding-agent recovery before normal use.

Outside Vibe64, provision the three distinct databases named in `.env.example`
with a grant that also covers their numbered copies (`database_app_%`), then run
`npm ci` and `npm run db:prepare`. `npm run test:e2e` builds the production
frontend once (reused while its sources are unchanged) and starts one server and
database copy per Playwright worker, within the machine's test budget, with your
installed Playwright browser. When supplying `PLAYWRIGHT_BASE_URL`, you own the
server and must select the isolated target before tests that write data.
Browser startup reports how many databases it prepared, whether it replayed the
migrations, and the restore and seed times; every run ends with its 10 slowest
tests. Do not install another browser in managed sessions.

Workspace setup also installs the version-matched JSKIT guides and source patterns
for the coding agent. Framework dependencies, their catalogue and documentation
are locked together; preparation does not silently upgrade the application.

To upgrade JSKIT, ask the coding agent to run `npm run jskit:update`. This existing
command updates the compatible framework graph and its local guidance together.
Review the dependency changes and run the relevant app checks before using them.

Colleague can explain these steps and offer coding-agent help; a how-to question
alone does not authorize test execution, fixture reset or schema changes.
