# Start from the JSKIT Accounts app

In an empty project's Preview, choose **JSKIT · Accounts app** and
**Use this starter**. This works on desktop and phone. Successful import adds
the application source and its complete Genesis contracts to the session;
use **Save** to keep that work in the project. Setup and Preview run the
operations declared in the starter's Stack.

The starter includes Preview login. After you register an account in the
Preview, name it in the Preview identity menu (by its email) and Preview can
sign in as it. Which accounts appear there is your choice; the starter never
creates users.

When you deploy the app, Deploy generates its session secret and the first
account's setup code. On an empty production database the first registration
asks for that code: open **Deploy**, choose **Reveal** or **Copy** on the
**First account setup code** card, then register in the app and enter it in
**Setup code**. The app sends no email, so production accounts skip email
confirmation; once an email sender is installed, set
`AUTH_LOCAL_EMAIL_CONFIRMATION` to `true` under **Production Env**.

If import reports missing Stack contracts while the destination project is
still empty, the rejected starter needs repair. Migrating that empty project
cannot repair the downloaded starter. Once the starter is corrected, retry
**Use this starter**. Do not add placeholder Stack sections to the destination
merely to suppress the error.

Colleague can explain the choices and offer to apply the selected starter.
Only after your direct request or accepted offer may it apply that exact
configured starter through its existing onboarding action, then recheck the
result. Application source remains in the session for review and **Save**.
