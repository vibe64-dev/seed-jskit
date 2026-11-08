# App Agent Instructions

Use current project context, JSKIT public APIs, and the official framework
documentation as the source of truth for application work.

Framework references:

- `https://mobily-enterprises.github.io/jskit-ai/guide/`
- `https://mobily-enterprises.github.io/jskit-ai/patterns/`

Before writing or reviewing code that reads or writes a database table, read
the data access guide at
`https://mobily-enterprises.github.io/jskit-ai/guide/framework/data-access`.

Before writing or reviewing server code (a feature, provider, action, service,
repository, route, error or test), read the typed features guide at
`https://mobily-enterprises.github.io/jskit-ai/guide/framework/typed-features`.
`npm run lint` checks its rules, and each finding links the section that
explains it; `npm run verify` adds the package graph, tests and build. Fix a
finding in the code; excuse one only with the guide's `readable-check: allow`
comment and reason prefix.

Before writing or reviewing client code (a composable, component, client
factory or client provider), read the client features guide at
`https://mobily-enterprises.github.io/jskit-ai/guide/framework/client-features`.
Simple, direct code comes first: never add a layer, wrapper, registry or tiny
module only to satisfy a rule. `npm run lint` checks its rules too.

Before writing or reviewing UI (a page, component, colour, icon or type
style), read the Material 3 guide at
`https://mobily-enterprises.github.io/jskit-ai/guide/framework/material-3`.
Colours are the theme's Material 3 roles (`on-surface-variant`,
`surface-container-low`, ...), generated from the seed in `src/theme/index.js`;
an icon is a `$` alias, and one JSKIT lacks goes in that file's `icons`. Never
hand-write Vuetify theme colours or icon sets in `src/main.js`: JSKIT's pages
draw with roles only the generated schemes define. `npx jskit check m3` checks
the guide's rules; `npm run verify` runs it and fails on any finding.

Before implementation, read the narrow relevant source pattern completely. If
its owner package is installed, prefer that version-matched package-owned copy.
Do not install an unrelated runtime package only to read documentation.

Pages start with useful content and actions. Do not add a page header, welcome
heading, or standalone title unless the user asks for one.

Copied pattern source is ordinary application source. Do not add generator
provenance, receipts, completion ledgers, or tooling-operation history. Keep
changes scoped to the user request and verify runtime behavior directly.
