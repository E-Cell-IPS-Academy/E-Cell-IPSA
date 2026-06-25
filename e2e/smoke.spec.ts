import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("home page loads and renders the app shell", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/E-Cell IPSA/i);
    await expect(page.locator("#root")).toBeVisible();
  });

  test("admin login route is reachable", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator("#root")).toBeVisible();
    await expect(page.getByRole("button")).toBeVisible();
  });
});
