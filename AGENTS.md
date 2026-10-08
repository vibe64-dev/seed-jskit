# App Agent Instructions

Database and tests are ready after the declared Workspace setup. Use
`npm test`, `npm run test:client`,
`npm run test:database`, or `vibe64-helper playwright --target browser-tests test`
in Vibe64. TEST_DB_NAME and BROWSER_TEST_DB_NAME are resource bindings. See
`docs/colleague-usage/testing.md`; do not invent database setup.

The standard CRUD server, resource and shared web-screen libraries are already
installed. Use their documented APIs directly; install additional dependencies
only when a feature needs a capability absent from the manifest.

Use current project context, JSKIT public APIs, and the official framework
documentation as the source of truth for application work.

Framework references installed with this starter's JSKIT release:

- `node_modules/@jskit-ai/agent-docs/skills/jskit/SKILL.md`
- `node_modules/@jskit-ai/agent-docs/patterns/INDEX.md`
- `node_modules/@jskit-ai/agent-docs/guide/agent/`

Read the installed JSKIT skill and the narrow relevant source pattern before
implementation. The documentation package includes complete pattern examples;
no runtime package installation or online documentation search is needed to read
them. Follow its existing application upgrade guidance when changing JSKIT release.

Pages start with useful content and actions. Do not add a page header, welcome
heading, or standalone title unless the user asks for one.

Copied pattern source is ordinary application source. Do not add generator
provenance, receipts, completion ledgers, or tooling-operation history. Keep
changes scoped to the user request and verify runtime behavior directly.
