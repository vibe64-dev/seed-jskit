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

The starter owns its dependencies and the setup, output, and verification
commands in `genesis/stack.md`. Genesis describes those requirements; Vibe64
runs the declared operations. Choosing a starter adds source to the session;
it does not create external services or invent connection values.

This variant needs Node.js 26 and dependency installation. It does not need a
database, account credentials, or a session secret. Its declared output is a
web application; use the conversation to shape it into your product.

The Stack's memory estimates are initial development planning hints for the
Node application and workspace setup, not measured requirements or memory limits.

## Check changes

```sh
npm run verify
npm exec --no -- playwright install chromium
npm run test:e2e
```

The browser suite checks home, settings, and adaptive navigation at compact, medium, and expanded widths.

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
