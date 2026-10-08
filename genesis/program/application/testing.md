# Test the application

Application tests are ready before the first feature.
`npm test` discovers only `tests/server/*.test.js`; launch scripts and the
isolated database integration suite have separate commands.

## Sources

- `package.json`
- `knexfile.js`
- `scripts/prepare-database.js`
- `scripts/test-environment.js`
- `scripts/test-database.js`
- `bin/develop-test.js`
- `tests/browser/database.js`
- `tests/server/database.integration.js`
- `tests/server/test-environment.test.js`
- `playwright.config.mjs`
- `docs/colleague-usage/testing.md`

## Public contract

Preparation installs the locked JSKIT packages, release catalogue and matching
agent documentation together. Agent instructions select those local guides and
complete patterns; ordinary preparation does not select a newer release.

Workspace setup installs the locked dependencies and runs ordinary JSKIT
migration preparation. Test commands select exact explicit test databases and
reject normal/shared identities or production mode. Integration and browser
databases stay separate. Browser setup retains schema and migration ledgers,
applies pending migrations and resets only browser fixtures with an explicit
seed. The declared browser-tests target advertises test data and uses the
host's assigned address. Standalone Playwright starts that same launcher rather
than reusing an arbitrary server. Managed Playwright uses the supplied Preview.
