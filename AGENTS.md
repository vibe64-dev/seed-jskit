# App Agent Instructions

Database and tests are ready after the declared Workspace setup. Use
`npm test`, `npm run test:client`,
`npm run test:database`, or `vibe64-helper playwright --target browser-tests test`
in Vibe64. TEST_DB_NAME and BROWSER_TEST_DB_NAME are resource bindings. See
`docs/colleague-usage/testing.md`; do not invent database setup.

Use current project context, JSKIT public APIs, and the official framework
documentation as the source of truth for application work.

Framework references:

- `https://mobily-enterprises.github.io/jskit-ai/guide/`
- `https://mobily-enterprises.github.io/jskit-ai/patterns/`

Before implementation, read the narrow relevant source pattern completely. If
its owner package is installed, prefer that version-matched package-owned copy.
Do not install an unrelated runtime package only to read documentation.

Pages start with useful content and actions. Do not add a page header, welcome
heading, or standalone title unless the user asks for one.

Copied pattern source is ordinary application source. Do not add generator
provenance, receipts, completion ledgers, or tooling-operation history. Keep
changes scoped to the user request and verify runtime behavior directly.
