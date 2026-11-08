# Self-service account settings

This boundary gives a signed-in person control over their own profile and
personal preferences.

## Sources

- Main: `src/pages/account/index.vue`
- `src/pages/account.vue`
- `src/pages/account/[section].vue`
- `tests/e2e/account-lifecycle.spec.ts`
- `src/placement.js`
- `packages/main/src/client/providers/MainClientProvider.js`
- `src/components/account/settings/AccountSettingsProfileSection.vue`
- `src/components/account/settings/AccountSettingsPreferencesSection.vue`
- `src/components/account/settings/AccountSettingsNotificationsSection.vue`

## Public contract

Signed-in people can view and update their display name, avatar, locale and
format preferences, and notification choices. The account email is visible but
cannot be edited as profile data. Loading preserves the settings layout,
validation remains beside the relevant field, and command failures use shared
feedback without shifting the form. The page renders under the account
surface's shell layout, whose top app bar carries its "Account settings" title
and an Up arrow to home. `/account` lists the sections; each section is its own
page at `/account/<section>` (`/account/profile`, `/account/preferences`,
`/account/notifications`), whose Up returns to the list. A phone or medium
window shows the list or one section; a wide window shows the list beside the
open section, or beside the first one on the list's own page.
