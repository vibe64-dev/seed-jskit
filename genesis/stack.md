# Stack

## Stack packages
- `genesis-stack`

## Components
- `nodejs`
- `jskit`
- `mysql`
- `jskit-mysql`

## Resources

```json genesis-resource
{
  "id": "database",
  "kind": "mysql",
  "environmentAlternatives": [
    {
      "bindings": {
        "database": "DB_NAME",
        "host": "DB_HOST",
        "password": "DB_PASSWORD",
        "port": "DB_PORT",
        "username": "DB_USER"
      },
      "allowEmpty": [
        "password"
      ],
      "preferred": true
    },
    {
      "bindings": {
        "url": "DATABASE_URL"
      }
    }
  ],
  "optionalBindings": {
    "testDatabase": "TEST_DB_NAME"
  }
}
```

## Environment defaults

- Default `DB_CLIENT`: `mysql2`

## Environment files

- Dotenv `.env`

## Verification

- Verify `application`: `npm` `run` `verify`

## Deployment

- Runtimes: `nodejs`
- Recreate on restore: `node_modules`
- Ready when: `GET` `/api/health` returns `200`
- Prepare `Install dependencies`: `npm` `ci`
- Prepare `Prepare database`: `npm` `run` `db:prepare`
- Build `Build`: `npm` `run` `build`
- Serve `Start`: `npm` `start`

## Outputs

### Target `app`: Run app

- Default.
- Mode: `interactive`
- Runtimes: `nodejs`
- Run `Develop`: `npm` `run` `develop`

#### Presentation

- Kind: `web`
- Preferred port: `3001`
- URL path: `/`
- Ready when: `GET` `/api/health` returns `200`

## Workspace setup

- Prepare `Install dependencies` with `nodejs` when `package.json` exists: `npm` `ci`
- Prepare `Prepare database` with `nodejs` when `package.json` exists: `npm` `run` `db:prepare`

## Resource estimates

### Output `app`

- Startup typical MiB: `1024`
- Startup high MiB: `1536`
- Running typical MiB: `768`
- Running high MiB: `1536`

### Workspace setup

- Typical MiB: `1024`
- High MiB: `1536`
