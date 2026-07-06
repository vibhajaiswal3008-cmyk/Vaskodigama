import { test, expect } from "@playwright/test";

test.describe("Vaskodigama smoke flows", () => {
  test("homepage renders the hero and search", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Trade data that tells you what to do next/i }),
    ).toBeVisible();
    await expect(page.getByRole("form", { name: "Global Trade Search" })).toBeVisible();
  });

  test("primary navigation works", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Platform" }).first().click();
    await expect(page).toHaveURL(/\/platform/);
  });

  test("mobile menu opens", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/");
    await page.getByRole("button", { name: /Open menu/i }).click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
  });

  test("product search routes to results", async ({ page }) => {
    await page.goto("/demo");
    const input = page.getByLabel("Product name");
    await input.fill("coffee");
    await page.locator('form[aria-label="Global Trade Search"] button[type="submit"]').click();
    await expect(page).toHaveURL(/term=coffee/i);
    await expect(page.getByRole("heading", { name: /coffee/i }).first()).toBeVisible();
  });

  test("results tabs include buyers and suppliers", async ({ page }) => {
    await page.goto("/demo");
    await expect(page.getByRole("tab", { name: "Buyer Intelligence" })).toBeVisible();
    await page.getByRole("tab", { name: "Buyer Intelligence" }).click();
    await expect(page.getByRole("heading", { name: /Top buyers for/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Supplier Intelligence" })).toBeVisible();
  });

  test("demo login routes into the dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.locator("#email").fill("demo@example.com");
    await page.locator("#password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("custom not-found page", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.getByText(/We couldn.t chart that page/)).toBeVisible();
  });
});
