# Run the starter's browser tests

This starter pins `@playwright/test` to `1.61.1`. Keep its package manifest and
lockfile consistent when changing dependencies. That version matches the current
Vibe64 managed browser runtime.

In Vibe64, finish Workspace setup in Preview first. Ask the coding agent to
inspect the application with the managed Preview browser, or to run the existing
suite with `vibe64-helper playwright test`. Tests that change database records
need a declared isolated test target and prepared test data. Colleague can explain
the steps and offer coding-agent assistance; a how-to question alone does not
authorise running tests or changing dependencies.

Outside Vibe64, supply the application's declared environment and resources,
prepare its dependencies and database where needed, and use `npm run test:e2e`.
Browser preparation belongs to that operator's Playwright installation.

If Vibe64 reports that the exact test version is unsupported, browser tests did
not start. Report the required version to the platform operator. Do not install a
replacement browser in the managed session. Interactive checks can still use
the managed Preview browser when Preview is ready.
