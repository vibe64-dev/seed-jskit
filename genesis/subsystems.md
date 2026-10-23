# Subsystems

## `hub` Accounts hub

Owns the hub's pages: sign-in for apps, the person's own account, and the
owner's Apps, People and Setup pages. The OpenID Connect protocol, accounts,
sessions and signing keys come from the installed `@jskit-ai/oidc-issuer-core`
package, which these pages call through `/hub/api`.

### Source

- Directory `src`

### Program

- `genesis/program/hub/shell.md`
- `genesis/program/hub/sign-in.md`
- `genesis/program/hub/account.md`
- `genesis/program/hub/owner.md`

### Data owned

- Table `database` `default` `oidc_issuer_accounts`
- Table `database` `default` `oidc_issuer_models`
- Table `database` `default` `oidc_issuer_clients`
- Table `database` `default` `oidc_issuer_signing_keys`
- Table `database` `default` `oidc_issuer_email_tokens`
- Table `database` `default` `oidc_issuer_rate_limits`

### Data used

- Nothing.

## `operations` Runtime operations

Owns startup, health checks, preparation of the application's database, the
hub commands and Preview sign-in.

### Source

- Directory `.`

### Program

- `genesis/program/operations/runtime.md`

### Data owned

- Nothing.

### Data used

- Table `database` `default` `oidc_issuer_accounts`
- Table `database` `default` `oidc_issuer_models`
- Table `database` `default` `oidc_issuer_clients`
- Table `database` `default` `oidc_issuer_signing_keys`
- Table `database` `default` `oidc_issuer_email_tokens`
- Table `database` `default` `oidc_issuer_rate_limits`
