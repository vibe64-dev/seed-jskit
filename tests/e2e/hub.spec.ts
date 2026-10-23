import { createHash, randomBytes } from "node:crypto";
import knex from "knex";
import { expect, test, type Page } from "@playwright/test";
import knexConfig from "../../knexfile.js";

// playwright.config.mjs gives the hub under test and these tests the same values.
const REGISTRATION_TOKEN = process.env.OIDC_HUB_REGISTRATION_TOKEN!;
const OWNER_EMAIL = process.env.OIDC_HUB_OWNER_EMAIL!;
const PASSWORD = "a browser test passphrase";

test.describe.configure({ mode: "serial" });

async function registerApp(baseURL: string, name: string, origin: string) {
  const response = await fetch(`${baseURL}/oidc/reg`, {
    method: "POST",
    headers: { authorization: `Bearer ${REGISTRATION_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify({ client_name: name, redirect_uris: [`${origin}/auth/callback`] })
  });
  expect(response.status).toBe(201);
  return { ...(await response.json()), status: response.headers.get("x-hub-client-status") };
}

function authorizationUrl(baseURL: string, client: { client_id: string; redirect_uris: string[] }) {
  const verifier = randomBytes(32).toString("base64url");
  return `${baseURL}/oidc/auth?${new URLSearchParams({
    client_id: client.client_id,
    redirect_uri: client.redirect_uris[0],
    response_type: "code",
    scope: "openid email profile",
    state: "browser-test",
    nonce: "browser-test",
    code_challenge: createHash("sha256").update(verifier).digest("base64url"),
    code_challenge_method: "S256"
  })}`;
}

// The app is not running. Playwright does not route the redirect that ends at
// the app's callback, so the hub's authorization responses are fetched here and
// a redirect to the callback is answered with a stand-in page.
async function catchCallback(page: Page, baseURL: string, origin: string) {
  await page.route((url) => url.href.startsWith(`${baseURL}/oidc/auth`), async (route) => {
    const response = await route.fetch({ maxRedirects: 0 });
    const location = response.headers().location || "";
    if (location.startsWith(`${origin}/auth/callback`)) {
      await route.fulfill({ contentType: "text/html", body: `<p>Back in the app</p><a id="callback" href="${location}">callback</a>` });
    } else {
      await route.fulfill({ response });
    }
  });
}

function callbackUrl(page: Page) {
  return page.locator("#callback").getAttribute("href").then((href) => new URL(href!));
}

async function signIn(page: Page, email: string) {
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
}

// The owner's email arrives by email; confirming it directly is the test's stand-in.
async function confirmOwnerEmail() {
  const db = knex(knexConfig);
  try {
    await db("oidc_issuer_accounts").where({ email: OWNER_EMAIL }).update({ email_verified: true });
  } finally {
    await db.destroy();
  }
}

test("the owner creates the account that opens Apps, People and Setup", async ({ page }) => {
  await page.goto("/auth/create-account");
  await page.getByLabel("Your name").fill("Owner Person");
  await page.getByLabel("Email").fill(OWNER_EMAIL);
  await page.getByLabel("Choose a password").fill(PASSWORD);
  await page.getByRole("button", { name: "Create account" }).click();
  const created = page.getByRole("heading", { name: "Your account" });
  const taken = page.getByText("This email already has an account.");
  await expect(created.or(taken)).toBeVisible();
  await confirmOwnerEmail();
});

test("an app on this computer signs in at once", async ({ page, baseURL }) => {
  const origin = "http://127.0.0.1:4999";
  const client = await registerApp(baseURL!, "Bookings", origin);
  expect(client.status).toBe("active-dev");
  await catchCallback(page, baseURL!, origin);
  await page.goto(authorizationUrl(baseURL!, client));
  await expect(page.getByRole("heading", { name: "Sign in to continue to Bookings" })).toBeVisible();
  await expect(page.getByText("127.0.0.1:4999")).toBeVisible();
  await signIn(page, OWNER_EMAIL);
  await expect(page.getByText("Back in the app")).toBeVisible();
  const callback = await callbackUrl(page);
  expect(callback.searchParams.get("code")).toBeTruthy();
  expect(callback.searchParams.get("iss")).toBe(baseURL);
});

test("an app on another address waits until the owner approves it", async ({ page, baseURL }) => {
  const origin = `https://shop-${randomBytes(4).toString("hex")}.example.test`;
  const client = await registerApp(baseURL!, "Shop", origin);
  expect(client.status).toBe("pending");
  await catchCallback(page, baseURL!, origin);

  await page.goto(authorizationUrl(baseURL!, client));
  await expect(page.getByRole("heading", { name: "This app is waiting for approval by the hub's owner." })).toBeVisible();
  await expect(page.getByText(origin)).toBeVisible();

  await page.goto("/auth/sign-in?next=/admin/apps");
  await signIn(page, OWNER_EMAIL);
  const row = page.locator(".app-row", { hasText: origin });
  await expect(page.getByText("Waiting for you")).toBeVisible();
  await row.getByRole("button", { name: "Approve" }).click();
  await expect(page.getByText(`Allow Shop at ${origin} to use your accounts?`)).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Approve" }).click();
  await expect(page.locator(".app-row", { hasText: origin }).getByRole("button", { name: "Remove" })).toBeVisible();

  await page.goto(authorizationUrl(baseURL!, client));
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Back in the app")).toBeVisible();
  expect((await callbackUrl(page)).searchParams.get("code")).toBeTruthy();
});

test("Setup counts what is ready and records the hub's own domain", async ({ page }) => {
  await page.goto("/auth/sign-in?next=/admin/setup");
  await signIn(page, OWNER_EMAIL);
  const progress = page.getByText(/\d of 9 ready/u);
  await expect(progress).toBeVisible();
  await expect(page.getByText("You are the owner.")).toBeVisible();
  const domain = page.locator(".check-row", { hasText: "Your hub has a domain of its own." });
  if (await domain.getByRole("button", { name: "Undo" }).isVisible()) {
    await domain.getByRole("button", { name: "Undo" }).click();
  }
  const before = Number((await progress.textContent())!.split(" ")[0]);
  await domain.getByRole("button", { name: "It has one" }).click();
  await expect(page.getByText(`${before + 1} of 9 ready`)).toBeVisible();
  await expect(domain.getByRole("button", { name: "Undo" })).toBeVisible();
});

test("someone who is not the owner cannot open owner pages", async ({ page }) => {
  const email = `person-${randomBytes(4).toString("hex")}@example.test`;
  await page.goto("/auth/create-account?next=/admin/people");
  await page.getByLabel("Your name").fill("Another Person");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Choose a password").fill(PASSWORD);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Only the hub's owner can open this page.")).toBeVisible();
});
