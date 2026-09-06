import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

test("register, update a profile, sign out, and sign back in to the persisted account", async ({ page }) => {
  const email = `starter-${randomUUID()}@example.test`;
  const password = "Starter-browser-test-2026!";
  await page.goto("/home");
  await expect(page).toHaveURL(/\/auth\/login/u);
  await page.getByTestId("auth-mode-register").click();
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password", { exact: true }).fill(password);
  await page.getByTestId("auth-submit").click();
  await expect(page).toHaveURL(/\/home/u);
  await expect(page.getByRole("heading", { name: "Welcome", exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Manage account" }).click();
  await page.getByLabel("Display name", { exact: true }).fill("Starter tester");
  await page.getByRole("button", { name: "Save profile", exact: true }).click();
  await expect(page.getByText("Profile updated.", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Display name", { exact: true })).toHaveValue("Starter tester");

  await page.goto("/home");
  await page.getByRole("button", { name: "Starter tester", exact: true }).click();
  await expect(page.getByRole("link", { name: "Sign in", exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(/\/auth\/login/u);
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill("incorrect-password");
  await page.getByTestId("auth-submit").click();
  await expect(page).toHaveURL(/\/auth\/login/u);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByTestId("auth-submit").click();
  await expect(page).toHaveURL(/\/home/u);
  await page.getByRole("link", { name: "Manage account" }).click();
  await expect(page.getByLabel("Display name", { exact: true })).toHaveValue("Starter tester");

  for (const width of [390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole("heading", { name: "Account settings", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  }
});
