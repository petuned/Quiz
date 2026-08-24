import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Mock, Procedure } from "@vitest/spy";

import testData from "./test_data";
import { renderWithProviders } from "./test_utils";

import { setupStore } from "../store/store";
import { startQuiz } from "../store/reducers/activeQuizReducer";

import QuestionController from "../components/Quiz/ActiveQuiz/QuestionController";

const mockShowQuestion: Mock<Procedure> = vi.fn();

describe("Questions component", () => {
  beforeAll(() => {
    const store = setupStore();

    store.dispatch(startQuiz(testData.testQuizzes[0]));
    renderWithProviders(
      <QuestionController setShowQuestion={mockShowQuestion} />,
      store
    );
  });
  afterAll(() => {
    cleanup();
  });
  it("shows the correct question and choices", () => {
    const firstSet = testData.testQuizzes[0].questions[0];
    const question = firstSet.question;
    const choices = firstSet.choices;

    expect(
      screen.getByText(question, {
        exact: false
      })
    ).toBeInTheDocument();
    choices.forEach((choice) => {
      expect(screen.getByText(choice)).toBeInTheDocument();
    });
  });
  it("prevents progressing if an answer hasn't been picked", async () => {
    const radioButtons = await screen.findAllByRole("radio");
    const progressButton = screen.getByRole("button", { name: "Next" });

    radioButtons.forEach((rb) => {
      expect(rb).not.toBeChecked();
    });
    expect(progressButton).toBeDisabled();
  });
  it("allows progressing after an answer has been picked", async () => {
    const pickedChoice = screen.getByRole("radio", {
      name: "HyperText Markup Language"
    });
    const progressButton = screen.getByRole("button", { name: "Next" });

    const user = userEvent.setup();
    await user.click(pickedChoice);

    expect(pickedChoice).toBeChecked();
    expect(progressButton).toBeEnabled();
  });
  it("still allows progressing after changing the answer", async () => {
    const progressButton = screen.getByRole("button", { name: "Next" });
    const newAnswer = screen.getByRole("radio", {
      name: "HighText Machine Language"
    });

    const user = userEvent.setup();
    await user.click(newAnswer);

    expect(newAnswer).toBeChecked();
    expect(progressButton).toBeEnabled();
  });
  it("shows the next question and choices after button click", async () => {
    const progressButton = screen.getByRole("button", { name: "Next" });
    const user = userEvent.setup();
    await user.click(progressButton);

    const secondSet = testData.testQuizzes[0].questions[1];
    const question = secondSet.question;
    const choices = secondSet.choices;

    expect(
      screen.getByText(question, {
        exact: false
      })
    ).toBeInTheDocument();
    choices.forEach((choice) => {
      expect(screen.getByText(choice)).toBeInTheDocument();
    });
  });
});
