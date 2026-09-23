import { test, expect } from "@playwright/test";

test.describe("existing user", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");
  });
  test("login successfully", async ({ page }) => {
    await page.getByRole("button", { name: "Login" }).click();

    await page.getByLabel("Username").fill("TestiTyyppi");
    await page.getByLabel("Password").fill("Testaamistavarten1");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText(/Hello Testari/)).toBeVisible();
  });
  test("show user's quizzes", async ({ page }) => {
    await page.getByRole("button", { name: "Login" }).click();

    await page.getByLabel("Username").fill("TestiTyyppi");
    await page.getByLabel("Password").fill("Testaamistavarten1");
    await page.getByRole("button", { name: "Login" }).click();

    await page.getByText("My Quizzes").click();
    await expect(page.getByText("Outlander")).toBeVisible();
  });
});
