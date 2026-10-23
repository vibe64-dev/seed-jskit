# Sign-in for apps

Signs people in, creates accounts, confirms emails, resets passwords and links
Google, both for the hub itself and for an app that sent the person here.

## Sources

- Main: `src/pages/auth/sign-in.vue`
- `src/pages/auth/create-account.vue`
- `src/pages/auth/confirm-email.vue`
- `src/pages/auth/forgot-password.vue`
- `src/pages/auth/reset-password.vue`
- `src/pages/auth/connect-google.vue`
- `src/lib/useSignInFlow.js`
- `src/components/hub/PasswordField.vue`
- `src/components/hub/GoogleButton.vue`
- `tests/e2e/hub.spec.ts`

## Public contract

- An app's sign-in arrives as `/auth/sign-in?interaction=<id>`. The page names
  the app and its full address; after sign-in it returns the person to the app.
- An app waiting for the owner's approval shows "This app is waiting for
  approval by the hub's owner." with a way back to the app.
- A signed-in person continues as themselves or chooses another account.
- A person whose email is not confirmed sees "Confirm your email to continue",
  can send the link again, and presses Continue once confirmed; no app receives
  an unconfirmed email.
- An expired sign-in says so and sends the person back to the app.
- Wrong email and wrong password get the same message. Repeated attempts are
  slowed down.
