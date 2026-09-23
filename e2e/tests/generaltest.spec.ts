import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await expect(page).toHaveTitle(/quiz app/);
});

test("heading visible", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await expect(page.getByRole("heading", { name: "Video Games" })).toBeVisible();
});

test("moves between categories", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByText("Education").click();

  await expect(
    page.getByRole("heading", { name: "Computer Science" })
  ).toBeVisible();
});

test("opens the quiz modal", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByText("Skyrim").click();

  await expect(page.getByText(/Cloud District/)).toBeVisible();
});

test("completes a quiz successfully", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Locate and start the quiz
  await page.getByText("General").click();
  await page.getByText("For testing purposes").click();
  await page.getByRole("button", { name: "Start" }).click();

  // Answer questions
  await page.getByText("Wednesday").click();
  await page.getByRole("button", { name: "Next" }).click();

  await page.getByText("A glass of water").click();
  await page.getByRole("button", { name: "Next" }).click();

  // Show the answer table
  await page.getByRole("button", { name: "Show answers" }).click();
  await expect(page.getByText(/Correct answer/)).toBeVisible();
});
