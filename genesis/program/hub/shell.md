# Hub shell

Frames every hub page. Sign-in pages use a centred card under the hub's own
address; signed-in pages use an app bar with the person's avatar menu, and, for
the owner, Apps, People and Setup as tabs on desktop and a bottom bar on phone.

## Sources

- Main: `src/components/hub/HubAppLayout.vue`
- `src/components/hub/HubAuthLayout.vue`
- `src/components/hub/EmptyState.vue`
- `src/components/hub/ConfirmDialog.vue`
- `src/lib/hubApi.js`
- `src/lib/useHubSession.js`
- `src/main.js`
- `index.html`
- `config/public.js`
- `src/views/NotFound.vue`
- `tests/e2e/startup.spec.ts`

## Public contract

- The initial document shows loading and Reload before JavaScript is available.
- The theme follows the device's light or dark setting.
- Every state-changing call sends `x-hub-request: 1`; the hub refuses calls
  without it.
- A signed-out visitor to a signed-in page goes to sign-in and comes back
  afterwards. Someone who is not the owner sees that only the owner can open
  owner pages.
