# Public application home

Visitors use the application through an adaptive shell.

## Sources

- `src/pages/home/index.vue`
- `src/components/ShellLayout.vue`
- `config/public.js`
- `server.js`

## Public contract

The root opens the public home. Navigation adapts to compact, medium, and
expanded screens, keeping home and settings reachable. The home reports the
result of the application health endpoint. No login or database is required.
