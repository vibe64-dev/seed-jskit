import { expect, test } from "@playwright/test";

const VIEWPORTS = Object.freeze([
  Object.freeze({ name: "compact", width: 390, height: 844 }),
  Object.freeze({ name: "medium", width: 768, height: 1024 }),
  Object.freeze({ name: "expanded", width: 1280, height: 900 })
]);

test.describe("authenticated entry", () => {
  for (const viewport of VIEWPORTS) {
    test(`${viewport.name} redirects private home to the responsive account entry`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/home");

      await expect(page).toHaveURL(/\/auth\/login/u);
      await expect(page.getByTestId("auth-mode-sign-in")).toBeVisible();
      await expect(page.getByTestId("auth-mode-register")).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Password", { exact: true })).toBeVisible();

      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    });
  }
});
