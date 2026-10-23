# JSKIT Accounts hub

One sign-in for all of your apps. This project is an **accounts hub**: an
OpenID Connect issuer that you own and run on a domain of its own, such as
`accounts.example.com`. Your apps send people here to sign in, the way an app
sends people to "Sign in with Google". People keep one account, one password
and one place to manage them.

- People create an account with email and password, confirm the email, reset a
  forgotten password, and can continue with Google once you add your own
  Google client.
- You, the owner, approve each app that wants to use your accounts, see
  everyone with an account, and follow a Setup checklist.
- Apps connect with two values: the hub's address and a registration token.

This repository has several application branches, including
[accounts](https://github.com/vibe64-dev/seed-jskit/tree/accounts) (an app
with its own local accounts) and `accounts-hub` (this hub).

## Quick start

Install Node.js 26 and Git. Create a MySQL/MariaDB database and an
application user that can create tables in it.

```sh
npm ci
cp .env.example .env
```

Fill in `.env` in this order:

1. The database: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.
2. `OIDC_HUB_OWNER_EMAIL`: your email. That account opens Apps, People and
   Setup once its email is confirmed.
3. `OIDC_HUB_REGISTRATION_TOKEN`: at least 24 random characters, for example
   from `openssl rand -base64 32`. Keep it secret; every app gets the same
   value.

Then:

```sh
npm run db:prepare
npm run develop
```

Open http://localhost:3001, create the account with your owner email and
confirm it. Without an email sender, development writes the confirmation link
to the server log. The page **Setup** then lists what is still missing.

### Settings

| Name | When | Meaning |
|---|---|---|
| `APP_PUBLIC_URL` | production | The hub's https address, which is its issuer. Development uses the development server's address. |
| `OIDC_HUB_SECRET` | production | At least 32 random bytes (`openssl rand -base64 48`). Protects cookies and stored signing keys; keep it the same across restarts. Development generates one in `.jskit/oidc-hub/`. |
| `OIDC_HUB_REGISTRATION_TOKEN` | always | Apps present it to register. |
| `OIDC_HUB_OWNER_EMAIL` | always | The owner's email. |
| `OIDC_HUB_DEV_ORIGIN_PATTERNS` | optional | Comma-separated `https://` addresses approved automatically, such as preview addresses: `https://preview-*.example.com`. `*` matches inside one part of the name. Apps on this computer are always approved. |
| `OIDC_HUB_EMAIL_FROM` with `RESEND_API_KEY` or `SMTP_URL` | production | Your own email sender for confirmation and recovery emails. |
| `OIDC_HUB_GOOGLE_CLIENT_ID`, `OIDC_HUB_GOOGLE_CLIENT_SECRET` | optional | Turn on "Continue with Google". Setup shows the redirect address to give Google. |

Keep secrets in your host's secret store, never in this repository. If a
setting is missing or wrong, the hub stops with one sentence naming it.

## Go live

1. Deploy the hub on its own domain (one that no other app shares) and set
   `APP_PUBLIC_URL` to its https address.
2. In your host's secret store, set `OIDC_HUB_SECRET`, the registration token,
   the owner email and an email sender.
3. Open **Setup**, confirm the domain, send a test email, and follow anything
   still marked.

## Connect an app

1. In the app, install `@jskit-ai/auth-provider-oidc-core` and follow its
   `auth/oidc-sign-in` pattern.
2. Give the app `AUTH_OIDC_ISSUER` (the hub's `APP_PUBLIC_URL`) and
   `AUTH_OIDC_REGISTRATION_TOKEN` (the hub's `OIDC_HUB_REGISTRATION_TOKEN`).
3. Sign in once from the app. An app on this computer, or on an address that
   matches `OIDC_HUB_DEV_ORIGIN_PATTERNS`, works straight away.
4. After the app is deployed, open the hub's **Apps** page and approve it at
   its full address. Until then its visitors see that the app is waiting for
   approval. Check the address, not the name: an app chooses its own name.

## Commands

```sh
npm run hub:keys:rotate                            # new signing key; the old one keeps working for two hours
npm run hub:import -- --in accounts.jsonl          # dry run: prints counts only
npm run hub:import -- --in accounts.jsonl --apply  # imports
```

`hub:import` reads the JSON Lines written by `jskit-oidc-sign-in
export-local-accounts` from an app that had JSKIT local accounts. Each person
keeps their account id and password; their email starts unconfirmed. Rows that
clash with a different hub account are refused and listed.

## Preview sign-in

`tools/preview-identity` and the Stack's `#### Preview identity` block let an
editor's Preview sign in as an existing hub account you name. It works only
when the host supplies `AUTH_DEV_BYPASS_ENABLED` and `AUTH_DEV_BYPASS_SECRET`
for that run, from this computer, and never in production.

## Use through Genesis

Install `genesis-compiler` and `genesis-stack`, run `genesis init` in an empty
Git repository, then choose `official:jskit/accounts-hub` with `genesis
templates apply`. The starter owns its dependencies and the setup, output and
verification commands in `genesis/stack.md`. Choosing it adds source; it does
not create a database, a domain or an email sender, and never invents secret
values. See [starting the hub](docs/colleague-usage/starting-app.md).

The Stack's memory estimates are initial development planning hints, not
measured requirements. They exclude the separately provided database server.

## Check changes

```sh
npm run verify
npm exec --no -- playwright install chromium
npm run test:e2e
```

Server and browser tests need a disposable test database prepared with
`npm run db:prepare`; server tests use `TEST_DB_NAME` when it is set, so they
never touch the development database in `DB_NAME`. Give the browser tests their own database: they keep a
fixed hub secret, and the hub refuses keys made with another one.
`npm run test:database` checks that an account and its password survive a
restart against the database in `DB_*`.

## Keep dependencies current

`npm ci` installs the reviewed versions in `package-lock.json`. To move all
JSKIT dependencies to the latest coordinated release, run `npm run
jskit:update`, then `npm run jskit:check`. Review other dependencies with `npm
outdated`, update them deliberately, and commit both the manifests and
lockfile after checking the hub.
