# Runtime readiness and database preparation

Supplies the operational entrypoints needed to prepare and run the hub.

## Sources

- `package.json`
- `scripts/prepare-database.js`
- `knexfile.js`
- Main: `server.js`
- `bin/develop.js`
- `server/lib/runtimeEnv.js`
- `tools/preview-identity`
- `tests/server/smoke.test.js`

## Public contract

Database preparation applies every pending migration, including the hub's
tables. The hub starts on port 3001 by default, serves its pages, the OpenID
Connect endpoints under `/.well-known` and `/oidc`, and its API under `/hub`,
and answers `/api/health`. A missing or invalid hub setting stops startup with
one sentence naming the variable to fix. In development the hub's address
defaults to the development server's address.

`npm run hub:keys:rotate` makes a new signing key. `npm run hub:import -- --in
<file> [--apply]` imports JSKIT local accounts with their passwords; without
`--apply` it only reports counts. `tools/preview-identity` lets a development
preview sign in as an existing account when the host enables it.
