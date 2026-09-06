# Email and password accounts

This boundary lets a person create and access a private account without using
an external identity provider.

## Sources

- `package.json`
- `config/public.js`
- `src/pages/auth/login.vue`
- `src/pages/auth/reset-password.vue`
- `src/pages/auth/signout.vue`

## Public contract

Visitors can register and sign in with an email address and password. Signed-in
people can sign out, while forgotten-password flows can request and complete a
password reset when recovery delivery is configured. Private surfaces redirect
visitors to the sign-in experience and preserve the intended return
destination. Authentication failures remain on the account surface without
exposing stored credentials.
