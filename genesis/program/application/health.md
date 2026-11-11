# Service health

Let operators determine whether the application server is available.

## Sources

- Main: `server.js`

## Public contract

A health request accepts no input and runs every health check the installed
packages register; this application has a `database` check that runs `select 1`. It answers `200` with
`ok: true`, each check's result under `checks` and the application's name when
every check passes, and `503` with `ok: false` when one fails or takes longer
than two seconds. The response names only which checks passed; a failure's
details go to the server log. It has no product-side effects.
