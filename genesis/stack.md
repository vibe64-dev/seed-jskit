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

## Connected development

- Default package type: `npm`

## Deployment

- Runtimes: `nodejs`
- Recreate on restore: `node_modules`
- Ready when: `GET` `/api/health` returns `200`
- Prepare `Install dependencies`: `npm` `ci`
- Build `Build`: `npm` `run` `build`
- Migrate `Migrate database`: `npm` `run` `db:migrate`
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

#### Preview identity

- Command: `tools/preview-identity`
- Protocol: `vibe64.preview-identity.command.v1`
- Identity types: `email` `user-id`
- Enabled environment: `AUTH_DEV_BYPASS_ENABLED`
- Secret environment: `AUTH_DEV_BYPASS_SECRET`
- Runtimes: `nodejs`

## Resource estimates

### Output `app`

- Startup typical MiB: `1024`
- Startup high MiB: `1536`
- Running typical MiB: `768`
- Running high MiB: `1536`

### Workspace setup

- Typical MiB: `1024`
- High MiB: `1536`

## UI discovery

### Discovery `home-pages`: Home pages

- Adapter: `jskit`
- Surface: `home`
- Mode: `filesystem`
- Page root: `src/pages/home`
- Registration: `vite.config.mjs`
- Component root: `src/components`
- Component root: `packages`

### Discovery `auth-pages`: Auth pages

- Adapter: `jskit`
- Surface: `auth`
- Mode: `filesystem`
- Page root: `src/pages/auth`
- Registration: `vite.config.mjs`
- Component root: `src/components`
- Component root: `packages`

### Discovery `account-pages`: Account pages

- Adapter: `jskit`
- Surface: `account`
- Mode: `filesystem`
- Page root: `src/pages/account`
- Registration: `vite.config.mjs`
- Component root: `src/components`
- Component root: `packages`

## Workspace setup

- Prepare `Install dependencies` with `nodejs` when `package.json` exists: `npm` `ci`
- Prepare `Prepare database` with `nodejs` when `package.json` exists: `npm` `run` `db:prepare`
