import { randomUUID } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";

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

test("signed out and signed in, every text is readable on its background in light and dark", async ({ page }) => {
  await inEachScheme(page, async (where) => {
    await page.goto("/auth/login");
    await expect(page.getByTestId("auth-mode-sign-in")).toBeVisible();
    await expectReadable(page, `${where} sign in`);
    await page.getByTestId("auth-mode-register").click();
    await expect(page.getByLabel("Confirm password", { exact: true })).toBeVisible();
    await expectReadable(page, `${where} registration`);
  });

  const email = `readable-${randomUUID()}@example.test`;
  const password = "Starter-browser-test-2026!";
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/auth/login");
  await page.getByTestId("auth-mode-register").click();
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password", { exact: true }).fill(password);
  await page.getByTestId("auth-submit").click();
  // Registering waits for the email address to be confirmed; outside production the page offers the link.
  await expect(page.getByTestId("auth-confirmation-dev-confirm")).toBeVisible();
  await expectReadable(page, "light 1280px email confirmation");
  await page.getByTestId("auth-confirmation-dev-confirm").click();
  await expect(page).toHaveURL(/\/home/u);

  await inEachScheme(page, async (where) => {
    await page.goto("/home");
    await expect(page.getByRole("link", { name: "Manage account" })).toBeVisible();
    await expectReadable(page, `${where} home`);

    await page.locator(".auth-profile-widget__activator").click();
    await expect(page.getByRole("link", { name: "Sign out", exact: true })).toBeVisible();
    await expectReadable(page, `${where} profile menu`);

    await page.goto("/account");
    await expect(page.getByRole("heading", { name: "Account settings", exact: true })).toBeVisible();
    await expectReadable(page, `${where} account settings`);
  });
});
