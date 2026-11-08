# Public application home

Visitors use the application through an adaptive shell.

## Sources

- `index.html`
- `src/main.js`
- `src/theme/index.js`
- `tests/e2e/readable-text.spec.ts`
- `tests/e2e/startup.spec.ts`
- Main: `src/pages/home/index.vue`
- `src/components/ShellLayout.vue`
- `config/public.js`
- `server.js`

## Public contract

The initial document shows loading and Reload before JavaScript is available.
Successful mounting replaces it; initialization failure retains a retry explanation.

The root opens the public home. Navigation adapts to compact, medium, and
expanded screens, keeping home and settings reachable. The home reports the
result of the application health endpoint. No login or database is required.

Home opens directly on its content and actions, following the current JSKIT
shell foundation.

Colours are Material 3: `@jskit-ai/material-web` generates the light and dark
schemes from the seed in `src/theme/index.js`, with every colour role the JSKIT
shell draws with, and the application follows the device's light or dark
setting. Every text on home and settings reads at WCAG contrast on its
background in both schemes.
