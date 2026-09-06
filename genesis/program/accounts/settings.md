# Self-service account settings

This boundary gives a signed-in person control over their own profile and
personal preferences.

## Sources

- `src/pages/account/index.vue`
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
feedback without shifting the form.
