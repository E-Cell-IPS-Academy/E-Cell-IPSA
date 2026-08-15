import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("home page serves and the app mounts", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/E-Cell IPSA/i);
    // The React app rendered something into the root (mount succeeded).
    await expect(page.locator("#root")).not.toBeEmpty();
  });

  test("admin login route mounts", async ({ page }) => {
    await page.goto("/admin/login", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#root")).not.toBeEmpty();
    await expect(
      page.getByRole("heading", { name: "Admin Portal" })
    ).toBeVisible();
  });
});
