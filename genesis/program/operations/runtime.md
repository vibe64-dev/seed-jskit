# Runtime readiness and database preparation

This boundary supplies the operational entrypoints needed to prepare and run
the application.

## Sources

- `package.json`
- `scripts/prepare-database.js`
- `knexfile.js`
- `server.js`
- `server/lib/runtimeEnv.js`

## Public contract

Database preparation applies every pending application and installed-package
migration using the configured MySQL connection. The application starts on
port 3001 by default, serves the browser application, and exposes a health
response for readiness checks. Missing or invalid database configuration stops
startup or preparation with an error instead of guessing credentials.
