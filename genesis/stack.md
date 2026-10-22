# Stack

## Stack packages
- `genesis-stack`

## Components
- `nodejs`
- `jskit`

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
- Serve `Start`: `npm` `start`

## Outputs

### Target `app`: Run app

- Default.
- Mode: `interactive`
- Runtimes: `nodejs`
- Run `Develop`: `npm` `run` `develop`

#### Presentation

- Kind: `web`
- Preferred port: `3000`
- URL path: `/`
- Ready when: `GET` `/api/health` returns `200`

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

### Discovery `vue-pages`: Application pages

- Adapter: `jskit`
- Surface: `home`
- Mode: `filesystem`
- Page root: `src/pages`
- Registration: `vite.config.mjs`
- Component root: `src/components`
- Component root: `packages`

## Workspace setup

- Prepare `Install dependencies` with `nodejs` when `package.json` exists: `npm` `ci`
