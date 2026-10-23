# App Agent Instructions

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

## This project is an accounts hub

It is the owner's own OpenID Connect sign-in service for all of their apps.
`README.md` is the setup order; the JSKIT guide "Run an accounts hub" and the
`auth/accounts-hub` pattern (installed in `@jskit-ai/oidc-issuer-core`) are the
framework rules.

- Ask the person for the owner email and the hub's domain. Never invent them,
  a secret or a token. Generate random secrets (`openssl rand -base64 48`) and
  store them in the host's secret store or Env, never in source or `.env`.
- Set `OIDC_HUB_SECRET` once and keep it: a hub started with another secret
  refuses its stored signing keys.
- Development patterns (`OIDC_HUB_DEV_ORIGIN_PATTERNS`) matter on the deployed
  hub, because other apps' development previews sign in through it.
- Approving apps, turning people off and confirming the domain are the owner's
  clicks on the hub's own pages. Report each Setup item as it is; do not say
  email or Google works until its Setup item is ready.
- Apps connect with `@jskit-ai/auth-provider-oidc-core` (pattern
  `auth/oidc-sign-in`), the hub's address as `AUTH_OIDC_ISSUER` and its
  registration token as `AUTH_OIDC_REGISTRATION_TOKEN`.
