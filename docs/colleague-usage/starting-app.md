# Start an accounts hub

An accounts hub gives all of your apps one sign-in. It is its own project, on a
domain of its own; each app links to it.

In an empty project's Preview, choose **JSKIT · Accounts hub** and **Use this
starter**. This works on desktop and phone. Successful import adds the hub's
source and its complete Genesis contracts to the session; use **Save** to keep
that work in the project. Setup and Preview run the operations declared in the
starter's Stack.

Before the first Preview, the hub needs these settings in Development Env
(names only; choose your own values). The coding agent can set them, asking you
for the email and generating the secrets:

- `OIDC_HUB_OWNER_EMAIL`: your email.
- `OIDC_HUB_REGISTRATION_TOKEN`: at least 24 random characters, kept secret.
- `OIDC_HUB_SECRET`: at least 32 random bytes, kept secret. Set it once and keep
  it: the hub's database outlives each session, and a hub started with another
  secret refuses its stored signing keys.

Your other apps sign in through the **deployed** hub, not through this
Preview. So its Production Env also needs `APP_PUBLIC_URL` (its own domain), a
new `OIDC_HUB_SECRET`, the registration token your apps will use, an email
sender, and `OIDC_HUB_DEV_ORIGIN_PATTERNS`: the `https://` pattern of your
apps' Preview addresses, so they are approved automatically. `README.md` lists
every setting.

If one is missing, Preview's log shows one sentence naming it. In the Preview,
create the account with your owner email and confirm it; then **Setup** lists
what is still missing before your apps rely on the hub.

The starter includes Preview login. After an account exists, name it in the
Preview identity menu (by its email) and Preview can sign in as it. The
starter never creates accounts.

If import reports missing Stack contracts while the destination project is
still empty, the rejected starter needs repair. Once the starter is corrected,
retry **Use this starter**. Do not add placeholder Stack sections to the
destination merely to suppress the error.

Colleague can explain the choices and offer to apply the selected starter.
Only after your direct request or accepted offer may it apply that exact
configured starter through its existing onboarding action, then recheck the
result. Application source remains in the session for review and **Save**.
