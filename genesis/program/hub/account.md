# Your account

Lets a signed-in person manage the one account they use for every connected
app.

## Sources

- Main: `src/pages/account/index.vue`
- `src/components/hub/SettingsSection.vue`
- `src/lib/format.js`

## Public contract

- Change name and password; a changed password keeps apps signed in.
- See whether the email is confirmed and send a new confirmation.
- Link or unlink Google. Unlinking needs a password first.
- See every device signed in, sign one out, or sign out everywhere, which also
  signs the person out of connected apps.
