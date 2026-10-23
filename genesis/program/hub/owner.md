# Owner pages

Apps, People and Setup, open only to the owner: the account with the
configured owner email, once confirmed.

## Sources

- Main: `src/pages/admin/apps.vue`
- `src/pages/admin/people.vue`
- `src/pages/admin/setup.vue`
- `src/components/hub/AppRow.vue`
- `src/components/hub/AppAvatar.vue`
- `tests/e2e/hub.spec.ts`

## Public contract

- Apps lists apps waiting for approval, approved apps and development apps,
  always with their full address, because an app chooses its own name.
  Approve asks "Allow {name} at {address} to use your accounts?". Block refuses
  the address from then on. Remove deletes the app's registration. Rotate
  signing key makes a new key; the old one keeps working for two hours.
- People lists every account; turning one off signs that person out
  everywhere, and turning it on lets them sign in again.
- Setup shows nine items, each ready, needing attention or not done, with one
  sentence and the variable or action that fixes it.
