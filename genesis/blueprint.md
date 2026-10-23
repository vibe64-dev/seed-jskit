# Blueprint

Visitors see an accessible loading shell before JavaScript initializes, with a
Reload link and an explanation if application initialization fails.

## One sign-in for all of your apps

This project is an accounts hub: a sign-in service that one person or company
owns and runs on a domain of its own. Each of the owner's apps sends people
here to sign in, the way an app sends people to "Sign in with Google". People
keep one account, one password and one place to manage them, and every app
receives the same account id for the same person.

The hub is an OpenID Connect issuer. Apps connect with two values: the hub's
address and a registration token the owner chooses. An app registers itself
the first time someone signs in through it.

## People

People create an account with their email and a password, confirm the email
(apps trust it, so an app sign-in waits until it is confirmed), reset a
forgotten password, and optionally continue with Google when the owner
has set up a Google client. On their account page they change their name and
password, link or unlink Google, see where they are signed in, and sign out of
one device or everywhere. When an app sends someone here, the hub names the app
and its full address before they sign in, and a signed-in person can continue
with one click.

## Owner

The owner is the account whose email is the configured owner email, once that
email is confirmed. The owner also sees:

- **Apps**: apps waiting for approval, approved apps, and development apps.
  Apps on this computer or on a configured development address work at once.
  Any other address waits until the owner approves it at its full address; the
  owner can also block an address, remove an app, and rotate the signing key.
  An app waiting for approval shows its visitors that it is waiting.
- **People**: everyone with an account. Turning an account off signs that
  person out of every connected app.
- **Setup**: a checklist of what the hub needs before apps rely on it, with a
  test email and the Google redirect address to copy.

Hub pages work in light and dark themes, on desktop and phone. Accounts,
sessions, apps and signing keys persist between restarts. Existing JSKIT local
accounts can be imported with their passwords.
