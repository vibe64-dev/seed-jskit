# JSKIT Public starter

An adaptive Fastify/Vue application with public home and settings pages. No accounts or database are required.

This repository has two application branches:

- [public](https://github.com/vibe64-dev/seed-jskit/tree/public): public app.
- [accounts](https://github.com/vibe64-dev/seed-jskit/tree/accounts): accounts and database.

## Run locally

Install Node.js 26 and Git.

```sh
npm ci
```

```sh
npm run develop
```

Open http://localhost:3000. `npm run build` followed by `npm start` serves a production build. `PORT` chooses the port.

## Use through Genesis or Vibe64

Install `genesis-compiler` and `genesis-stack`, run `genesis init` in an empty Git repository, then choose `official:jskit/public` with `genesis templates apply`. Vibe64 offers the same starter in the Preview pane. Genesis preserves the destination's history and authored project context; ordinary Git commits or Vibe64 Save keep your new source.

The portable setup, run, and verification commands are in `genesis/stack.md`.
A host can provide Node, preview routing, and database resources; on the command
line you supply these prerequisites yourself. Opening a coding session does
not run dependency installation, database migrations, or verification.

The Stack's memory estimates are initial development planning hints for the
Node application and workspace setup, not measured requirements or memory limits.

## Check changes

```sh
npm run verify
npm run test:e2e
```

The browser suite checks home, settings, and adaptive navigation at compact, medium, and expanded widths.

These starters are maintained from `gen1_codex`, `gen1_opencode`,
`gen2_codex`, and `gen2_opencode`. The public branch combines the Gen1 adaptive shell, health contract, and home checks. They contain no generated account credentials or
installed dependencies. Add product capabilities through JSKIT public APIs and
package-owned source patterns.
