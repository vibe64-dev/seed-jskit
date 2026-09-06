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

## Workspace setup

- Prepare `Install dependencies` with `nodejs` when `package.json` exists: `npm` `ci`
