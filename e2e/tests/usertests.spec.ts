import { test, expect } from "@playwright/test";
import testdata from "../utils";
import { generateName } from "../utils";

test.describe("existing user: login", () => {
  test("login successfully", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.getByRole("button", { name: "Login" }).click();

    await page.getByLabel("Username").fill(testdata.user.username);
    await page.getByLabel("Password").fill(testdata.user.password);
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText(`Hello ${testdata.user.name}`)).toBeVisible();
  });
});

test.describe("existing user: quizzes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");

    await page.getByRole("button", { name: "Login" }).click();
    await page.getByLabel("Username").fill(testdata.user.username);
    await page.getByLabel("Password").fill(testdata.user.password);
    await page.getByRole("button", { name: "Login" }).click();
  });
  test("show user's quizzes", async ({ page }) => {
    await page.getByText("My Quizzes").click();
    await expect(page.getByText(testdata.quiz.name)).toBeVisible();
  });
  test("create a new quiz", async ({ page }) => {
    await page.getByRole("button", { name: "Create" }).click();

    const quizName = generateName();
    await page.getByLabel(/Quiz Title/).fill(quizName);
    await page.getByLabel(/Category/).fill(testdata.newQuiz.subcategory);
    await page.getByLabel(/Description/).fill(testdata.newQuiz.description);
    await page.getByLabel(/Question/).fill(testdata.newQuiz.questions[0].question);

    const quizChoices = testdata.newQuiz.questions[0].choices;
    const choices = await page.getByPlaceholder(/Choice/).all();
    let i = 0;
    for (const choice of choices) {
      await choice.fill(quizChoices[i]);
      i++;
    }
    await page.getByRole("button", { name: "Add Question" }).click();
    await page.getByRole("button", { name: "Save Quiz" }).click();

    // Navigate back to user quizzes and confirm the result
    await page.getByRole("button", { name: "Cancel" }).click();
    await page.getByText("My Quizzes").click();
    await expect(page.getByText(quizName, { exact: true })).toBeVisible();
  });
});
