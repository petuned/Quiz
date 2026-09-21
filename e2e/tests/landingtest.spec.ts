import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/quiz app/);
});

test("heading visible", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole("heading", { name: "Video Games" })).toBeVisible();
});
