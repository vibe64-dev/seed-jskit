# Shell navigation

Composes the adaptive shell's navigation and status areas from placements.
Defines where top-level menu, section-navigation, identity, and status content
render across compact, medium, and expanded layouts.

## Sources

- Main: `src/components/ShellLayout.vue`
- `index.html`
- `tests/e2e/startup.spec.ts`
- `src/placement.js`
- `src/placementTopology.js`
- `config/public.js`
- `src/main.js`
- `src/theme/index.js`
- `tests/e2e/readable-text.spec.ts`
- `packages/main/src/client/providers/MainClientProvider.js`

## Public contract

- The initial document shows loading and Reload before JavaScript is available.
  Successful mounting replaces it; initialization failure retains a retry explanation.
- The `home` surface is the default private surface. Signing in makes its Home
  link available; unauthenticated visitors are directed to the account entry.
- Primary navigation adapts to compact, medium, and expanded layouts. Account
  status and the profile menu remain reachable at each size.
- The profile menu offers account settings and sign-out to signed-in people.
- Colours are Material 3: `@jskit-ai/material-web` generates the light and dark
  schemes from the seed in `src/theme/index.js`, with every colour role JSKIT's
  shell, sign-in and account pages draw with, and the app follows the device's
  light or dark setting. Every text, signed out and signed in, reads at WCAG
  contrast on its background in both schemes.
- Client route components are registered by the app-local main provider
  (`local.main.*`) for use as placement renderers.
