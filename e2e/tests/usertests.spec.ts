import { test, expect, request } from "@playwright/test";
import testdata, { getTestUser } from "../utils";
const { existingQuizInfo, newQuiz, mutableQuizInfo, deletableQuizInfo } = testdata;

test.describe("existing user: login", () => {
  test("login successfully", async ({ page }, testInfo) => {
    const user = getTestUser(testInfo);
    await page.goto("http://localhost:5173/");
    await page.getByRole("button", { name: "Login" }).click();

    await page.getByLabel("Username").fill(user.username);
    await page.getByLabel("Password").fill(user.password);
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText(`Hello ${user.name}`)).toBeVisible();
  });
});

test.describe("existing user: quizzes", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const user = getTestUser(testInfo);
    await page.goto("http://localhost:5173/");

    await page.getByRole("button", { name: "Login" }).click();
    await page.getByLabel("Username").fill(user.username);
    await page.getByLabel("Password").fill(user.password);
    await page.getByRole("button", { name: "Login" }).click();
  });
  test("show user's quizzes", async ({ page }) => {
    await page.getByText("My Quizzes").click();
    await expect(page.getByText(existingQuizInfo.name)).toBeVisible();
  });
  test("create a new quiz", async ({ page }) => {
    await page.getByRole("button", { name: "Create" }).click();

    await page.getByLabel(/Quiz Title/).fill(newQuiz.name);
    await page.getByLabel(/Category/).fill(newQuiz.subcategory);
    await page.getByLabel(/Description/).fill(newQuiz.description);
    await page.getByLabel(/Question/).fill(newQuiz.questions[0].question);

    const quizChoices = newQuiz.questions[0].choices;
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
    await expect(page.getByText(newQuiz.name, { exact: true })).toBeVisible();
  });
  test("modify a quiz", async ({ page }) => {
    await page.getByText("My Quizzes").click();
    await page.getByText(mutableQuizInfo.name).click();
    await page.getByRole("button", { name: "Edit" }).click();

    await page.getByLabel(/Description/).fill(mutableQuizInfo.newDescription);
    await page.getByRole("button", { name: "Save Quiz" }).click();

    // Navigate back to user quizzes and confirm the result
    await page.getByRole("button", { name: "Cancel" }).click();
    await page.getByText("My Quizzes").click();
    await page.getByText(mutableQuizInfo.name, { exact: true }).click();
    await expect(page.getByText(mutableQuizInfo.newDescription)).toBeVisible();
  });
  test("delete a quiz", async ({ page }) => {
    page.on("dialog", (dialog) => dialog.accept());

    await page.getByText("My Quizzes").click();
    await page.getByText(deletableQuizInfo.name).click();
    await page.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText(deletableQuizInfo.name)).not.toBeVisible();
  });
});
