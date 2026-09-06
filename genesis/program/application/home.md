# Private home

This boundary gives a signed-in person a responsive starting point and access
to account controls.

## Sources

- `src/pages/home.vue`
- `src/pages/home/index.vue`
- `src/components/ShellLayout.vue`
- `src/placement.js`
- `src/placementTopology.js`

## Public contract

The home is private and redirects visitors to sign in. Once authenticated, a
person sees the application shell at compact, medium, and expanded sizes, can
open account settings, and can reach sign-out from the profile menu.
