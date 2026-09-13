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

The portable setup, run, and verification commands are in `genesis/stack.md`.
A host can provide Node, preview routing, and database resources; on the command
line you supply these prerequisites yourself. Opening a coding session does
not run dependency installation, database migrations, or verification.

The Stack's memory estimates are initial development planning hints for the
Node application and workspace setup, not measured requirements or memory limits.
They exclude the separately provided database server.

## Check changes

```sh
npm run verify
npm run test:e2e
```

Browser tests use the database environment you provide; use a disposable test database, prepare it with `npm run db:prepare`, and keep the application session secret stable across restarts.

These starters are maintained from `gen1_codex`, `gen1_opencode`,
`gen2_codex`, and `gen2_opencode`. The accounts branch combines the Gen2 authentication/database app, navigation conditions, and shell contract. They contain no generated account credentials or
installed dependencies. Add product capabilities through JSKIT public APIs and
package-owned source patterns.

### Database integration check

`npm run test:database` verifies the selected database, prepares it twice, and
tests registration, profile updates, login after a server restart, rejected
anonymous reads, and separate account profiles through the real server. Set
`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` explicitly; an empty
password is allowed. Set `TEST_DB_NAME` to the same dedicated test database name
as `DB_NAME`. This test leaves identifiable `migration-` and `other-` fixture
accounts in that disposable database. The normal smoke test remains available
without one.
