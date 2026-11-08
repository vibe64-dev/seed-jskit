import { createHash, randomBytes } from "node:crypto";
import knex from "knex";
import { expect, test, type Page } from "@playwright/test";
import knexConfig from "../../knexfile.js";

// playwright.config.mjs gives the hub under test and these tests the same values.
const REGISTRATION_TOKEN = process.env.OIDC_HUB_REGISTRATION_TOKEN!;
const OWNER_EMAIL = process.env.OIDC_HUB_OWNER_EMAIL!;
const PASSWORD = "a browser test passphrase";
const SCHEMES = Object.freeze(["light", "dark"] as const);
const WIDTHS = Object.freeze([390, 1280]);

// Every text the page draws, measured against the background it is drawn on as WCAG 2 measures it: at least 4.5:1, or
// 3:1 for large text (24px, or 18.66px bold). Text in a colour role the theme does not define, or defines for another
// surface (Vuetify's own on-surface-variant is near-white, for its dark surface-variant), shows up here as text in
// nearly the colour of its background. Disabled controls are exempt, as in WCAG.
function unreadableText(page: Page) {
  return page.evaluate(() => {
    type Rgba = { r: number, g: number, b: number, a: number };
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true })!;
    // Any computed colour (rgb(), color(srgb ...), oklch(), ...) as the sRGB pixel it paints.
    const pixel = (color: string): Rgba => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
      return { r, g, b, a: a / 255 };
    };
    const over = (top: Rgba, alpha: number, base: Rgba): Rgba => ({
      r: top.r * alpha + base.r * (1 - alpha),
      g: top.g * alpha + base.g * (1 - alpha),
      b: top.b * alpha + base.b * (1 - alpha),
      a: 1
    });
    const luminance = ({ r, g, b }: Rgba) => {
      const [red, green, blue] = [r, g, b].map((channel) => {
        const value = channel / 255;
        return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };
    const contrast = (first: Rgba, second: Rgba) => {
      const [lighter, darker] = [luminance(first), luminance(second)].sort((left, right) => right - left);
      return (lighter + 0.05) / (darker + 0.05);
    };
    const hex = ({ r, g, b }: Rgba) => `#${[r, g, b].map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("")}`;
    const exempt = "[disabled], [aria-disabled='true'], .v-btn--disabled, .v-input--disabled, .v-list-item--disabled, script, style, noscript, template";

    const findings = new Map<string, string>();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = String(node.textContent || "").replace(/\s+/gu, " ").trim();
      const element = node.parentElement;
      if (!text || !element || element.closest(exempt) || findings.has(text)) continue;
      if (!element.checkVisibility({ checkVisibilityCSS: true, visibilityProperty: true })) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const box = range.getBoundingClientRect();
      if (box.width < 1 || box.height < 1) continue;

      // The text's own opacity is every ancestor's; its background is the backgrounds behind it, down to the first
      // opaque one, over the white page.
      let opacity = 1;
      const layers: Rgba[] = [];
      let opaque = false;
      for (let current: Element | null = element; current; current = current.parentElement) {
        const style = window.getComputedStyle(current);
        opacity *= Number(style.opacity);
        if (opaque) continue;
        const background = pixel(style.backgroundColor);
        if (background.a > 0) layers.push(background);
        opaque = background.a >= 1;
      }
      // Not drawn yet, such as a label before its transition.
      if (opacity < 0.01) continue;
      let background: Rgba = { r: 255, g: 255, b: 255, a: 1 };
      for (const layer of layers.reverse()) background = over(layer, layer.a, background);

      const style = window.getComputedStyle(element);
      const color = pixel(style.color);
      const foreground = over(color, color.a * opacity, background);
      const size = Number.parseFloat(style.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
      const ratio = contrast(foreground, background);
      if (ratio < (large ? 3 : 4.5)) {
        findings.set(text, `"${text.slice(0, 60)}" ${ratio.toFixed(2)}:1, ${hex(foreground)} on ${hex(background)}`);
      }
    }
    return [...findings.values()];
  });
}

// Soft, so one run lists every page's unreadable text.
async function expectReadable(page: Page, where: string) {
  await expect.configure({ soft: true })
    .poll(() => unreadableText(page), { message: `${where}: text below its contrast minimum`, timeout: 5_000 })
    .toEqual([]);
}

async function inEachScheme(page: Page, check: (where: string) => Promise<void>) {
  for (const colorScheme of SCHEMES) {
    for (const width of WIDTHS) {
      await page.emulateMedia({ colorScheme });
      await page.setViewportSize({ width, height: 900 });
      await check(`${colorScheme} ${width}px`);
    }
  }
}

async function registerApp(baseURL: string, name: string, origin: string) {
  const response = await fetch(`${baseURL}/oidc/reg`, {
    method: "POST",
    headers: { authorization: `Bearer ${REGISTRATION_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify({ client_name: name, redirect_uris: [`${origin}/auth/callback`] })
  });
  expect(response.status).toBe(201);
  return response.json();
}

function authorizationUrl(baseURL: string, client: { client_id: string; redirect_uris: string[] }) {
  return `${baseURL}/oidc/auth?${new URLSearchParams({
    client_id: client.client_id,
    redirect_uri: client.redirect_uris[0],
    response_type: "code",
    scope: "openid email profile",
    state: "readable-text",
    nonce: "readable-text",
    code_challenge: createHash("sha256").update(randomBytes(32).toString("base64url")).digest("base64url"),
    code_challenge_method: "S256"
  })}`;
}

// The owner's email arrives by email; confirming it directly is the test's stand-in. An earlier spec in this worker
// may have created the owner already, so creating it again may be refused.
async function ensureOwner(baseURL: string) {
  await fetch(`${baseURL}/hub/api/accounts`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-hub-request": "1" },
    body: JSON.stringify({ displayName: "Owner Person", email: OWNER_EMAIL, password: PASSWORD })
  });
  const db = knex(knexConfig);
  try {
    await db("oidc_issuer_accounts").where({ email: OWNER_EMAIL }).update({ email_verified: true });
  } finally {
    await db.destroy();
  }
}

test("signed out, signed in and as the owner, every text is readable on its background in light and dark", async ({ page, baseURL }) => {
  test.setTimeout(240_000);

  await inEachScheme(page, async (where) => {
    await page.goto("/auth/sign-in");
    await expect(page.getByRole("heading", { name: "Sign in", exact: true })).toBeVisible();
    await expectReadable(page, `${where} sign in`);
    await page.goto("/auth/create-account");
    await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
    await expectReadable(page, `${where} create account`);
    await page.goto("/auth/forgot-password");
    await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
    await expectReadable(page, `${where} forgot password`);
    await page.goto("/auth/reset-password");
    await expect(page.getByRole("heading", { name: "This link has expired." })).toBeVisible();
    await expectReadable(page, `${where} expired reset link`);
    await page.goto("/auth/connect-google");
    await expect(page.getByRole("heading", { name: "This connection has expired." })).toBeVisible();
    await expectReadable(page, `${where} expired Google connection`);
    await page.goto("/auth/no-such-page");
    await expect(page.getByText("This page does not exist.")).toBeVisible();
    await expectReadable(page, `${where} not found`);
  });

  // Someone who is not the owner, with their email not yet confirmed.
  await page.emulateMedia({ colorScheme: "light" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/auth/create-account");
  await expect(page.getByLabel("Your name")).toBeFocused();
  await page.getByLabel("Your name").fill("Readable Person");
  await page.getByLabel("Email").fill(`readable-${randomBytes(4).toString("hex")}@example.test`);
  await page.getByLabel("Choose a password").fill(PASSWORD);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "Your account", exact: true })).toBeVisible();
  const localApp = await registerApp(baseURL!, "Bookings", "http://127.0.0.1:4998");
  await inEachScheme(page, async (where) => {
    await page.goto("/account");
    await expect(page.getByText("Not confirmed", { exact: true })).toBeVisible();
    await expectReadable(page, `${where} account, email not confirmed`);
    await page.goto("/admin/people");
    await expect(page.getByText("Only the hub's owner can open this page.")).toBeVisible();
    await expectReadable(page, `${where} owner page refused`);
    await page.goto(authorizationUrl(baseURL!, localApp));
    await expect(page.getByRole("heading", { name: "Confirm your email to continue" })).toBeVisible();
    await expectReadable(page, `${where} app sign-in, email not confirmed`);
  });
  await page.goto("/account");
  await page.getByRole("button", { name: "Your account menu" }).click();
  await page.getByRole("menuitem", { name: "Sign out" }).click();
  await expect(page.getByRole("heading", { name: "Sign in", exact: true })).toBeVisible();

  // The owner, with an app waiting for approval.
  await ensureOwner(baseURL!);
  await page.goto("/auth/sign-in?next=/account");
  await expect(page.getByLabel("Email")).toBeFocused();
  await page.getByLabel("Email").fill(OWNER_EMAIL);
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your account", exact: true })).toBeVisible();
  const origin = `https://shop-${randomBytes(4).toString("hex")}.example.test`;
  const waitingApp = await registerApp(baseURL!, "Shop", origin);
  const row = page.locator(".app-row", { hasText: origin });
  await inEachScheme(page, async (where) => {
    await page.goto("/account");
    await expect(page.getByText("Confirmed", { exact: true })).toBeVisible();
    await expectReadable(page, `${where} account`);
    await page.getByRole("button", { name: "Your account menu" }).click();
    await expect(page.getByRole("menuitem", { name: "Sign out" })).toBeVisible();
    await expectReadable(page, `${where} account menu`);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menuitem", { name: "Sign out" })).toBeHidden();

    await page.goto("/admin/apps");
    await expect(row.getByRole("button", { name: "Approve" })).toBeVisible();
    await expectReadable(page, `${where} apps`);
    await row.getByRole("button", { name: "Approve" }).click();
    await expect(page.getByText(`Allow Shop at ${origin} to use your accounts?`)).toBeVisible();
    await expectReadable(page, `${where} approve dialog`);
    await page.getByRole("dialog").getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    await page.goto("/admin/people");
    await expect(page.locator(".person-row", { hasText: OWNER_EMAIL })).toBeVisible();
    await expectReadable(page, `${where} people`);
    await page.goto("/admin/setup");
    await expect(page.getByText(/\d of 9 ready/u)).toBeVisible();
    await expectReadable(page, `${where} setup`);
    await page.goto(authorizationUrl(baseURL!, waitingApp));
    await expect(page.getByRole("heading", { name: "This app is waiting for approval by the hub's owner." })).toBeVisible();
    await expectReadable(page, `${where} app sign-in waiting for approval`);
  });

  await page.goto("/admin/apps");
  await row.getByRole("button", { name: "Approve" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Approve" }).click();
  await expect(row.getByRole("button", { name: "Remove" })).toBeVisible();
  await inEachScheme(page, async (where) => {
    await page.goto(authorizationUrl(baseURL!, waitingApp));
    await expect(page.getByRole("heading", { name: "Sign in to continue to Shop" })).toBeVisible();
    await expectReadable(page, `${where} app sign-in, continue as the owner`);
  });
});
