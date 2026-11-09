# Email and password accounts

This boundary lets a person create and access a private account without using
an external identity provider.

## Sources

- `package.json`
- `config/public.js`
- `server/lib/runtimeEnv.js`
- Main: `src/pages/auth/login.vue`
- `src/pages/auth/reset-password.vue`
- `src/pages/auth/signout.vue`

## Public contract

Visitors can register and sign in with an email address and password. Signed-in
people can sign out, while forgotten-password flows can request and complete a
password reset when recovery delivery is configured. Private surfaces redirect
visitors to the sign-in experience and preserve the intended return
destination. Authentication failures remain on the account surface without
exposing stored credentials.

A new account confirms its email address before it exists; in development the
sign-in page shows the confirmation link. The app installs no email sender, so
in production accounts are created without confirmation unless
`AUTH_LOCAL_EMAIL_CONFIRMATION` is set. On an empty production database the
first registration needs the setup code in `AUTH_LOCAL_SETUP_CODE`, which a
Vibe64 deployment generates and shows only to the project owner.
