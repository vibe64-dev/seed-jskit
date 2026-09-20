# JSKIT Accounts starter

An adaptive Fastify/Vue application with local sign-up, login, account settings, and MySQL persistence. Home and account settings require login.

This repository has two application branches:

- [public](https://github.com/vibe64-dev/seed-jskit/tree/public): public app.
- [accounts](https://github.com/vibe64-dev/seed-jskit/tree/accounts): accounts and database.

## Run locally

Install Node.js 26 and Git. Create a MySQL/MariaDB database and an application user with permission to migrate its tables.

```sh
npm ci
cp .env.example .env
```

Edit `.env` with your own database connection. Generate a fresh session secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` and set `AUTH_LOCAL_SESSION_SECRET`. Keep `.env` private. Then run:

```sh
npm run db:prepare
npm run develop
```

Open http://localhost:3001. `npm run build` followed by `npm start` serves a production build. `PORT` chooses the port. Password recovery needs a separately configured delivery service.

## Use through Genesis or Vibe64

Install `genesis-compiler` and `genesis-stack`, run `genesis init` in an empty Git repository, then choose `official:jskit/accounts` with `genesis templates apply`. Vibe64 offers the same starter in the Preview pane. Genesis preserves the destination's history and authored project context; ordinary Git commits or Vibe64 Save keep your new source.

The starter owns its dependencies and the setup, output, and verification
commands in `genesis/stack.md`. Genesis describes those requirements; Vibe64
runs the declared operations. Choosing a starter adds source to the session;
it does not create external services or invent connection values.

For standalone Vibe64, supply your existing MySQL/MariaDB connection through
Dashboard → Env: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD`
(or the application's supported `DATABASE_URL`). Also set a fresh
`AUTH_LOCAL_SESSION_SECRET` using the generation command above. These values
belong to your environment, not the starter's source. A managed host may supply
the resources it owns; do not copy its credentials into this repository.

Return to the project and recheck setup. The declared workspace preparation
installs dependencies and applies migrations before the web output starts.
Preparation failures remain actionable; choosing a starter alone does not
prove that its external services are available.

The Stack's memory estimates are initial development planning hints for the
Node application and workspace setup, not measured requirements or memory limits.
They exclude the separately provided database server.

## Check changes

```sh
npm run verify
npm exec --no -- playwright install chromium
npm run test:e2e
```

Browser tests use the database environment you provide; use a disposable test database, prepare it with `npm run db:prepare`, and keep the application session secret stable across restarts.

### Database integration check

`npm run test:database` verifies the selected database, prepares it twice, and
tests registration, profile updates, login after a server restart, rejected
anonymous reads, and separate account profiles through the real server. Set
`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` explicitly; an empty
password is allowed. Set `TEST_DB_NAME` to the same dedicated test database name
as `DB_NAME`. This test leaves identifiable `migration-` and `other-` fixture
accounts in that disposable database. The normal smoke test remains available
without one.

The starter follows the published JSKIT shell foundation and package-owned
source patterns. It contains no installed dependencies or generated account
credentials. Add capabilities through JSKIT public APIs.

## Keep dependencies current

`npm ci` installs the reviewed versions in `package-lock.json`. To move all
root and workspace JSKIT dependencies to the latest coordinated release, run
`npm run jskit:update`, then `npm run jskit:check`. Review `npm outdated` for
other dependencies, update their declarations deliberately, and commit both
the manifests and lockfile after checking the application.

Pinia 4 and its required `@vue/devtools-api` peer are declared together.
Keep them compatible with the coordinated JSKIT shell and authentication
packages; do not bypass peer conflicts with npm overrides or force flags.

Dependency updates do not refresh copied application source. Compare changed
framework patterns with the application's bootstrap, routes, and tests when
upgrading. Check server and client behavior, production builds, and browser
navigation before publishing either starter branch.
