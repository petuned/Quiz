/** This component was partially generated with AI */

import { useEffect, useState } from "react";
import type { QuizQuestion } from "../../types";

interface Props {
  onAddQuestion: (question: QuizQuestion) => void;
  initQuestion?: { index: number; question: QuizQuestion };
}

const QuestionForm = ({ onAddQuestion, initQuestion }: Props) => {
  const [questionText, setQuestionText] = useState<string>("");
  const [choices, setChoices] = useState<string[]>(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (initQuestion) {
      setQuestionText(initQuestion.question.question);
      setChoices(initQuestion.question.choices);
      setCorrectAnswer(initQuestion.question.answer);
    }
  }, [initQuestion]);

  const handleChoiceChange = (index: number, value: string) => {
    if (choices.find((c) => c === value)) {
      setErrorMessage("Choices have to be unique");
    } else {
      setErrorMessage("");
    }

    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);

    if (correctAnswer === choices[index]) {
      setCorrectAnswer(value);
    }
  };

  const addChoice = () => {
    if (choices.length < 5) {
      setChoices((prev) => [...prev, ""]);
    }
  };

  const removeChoice = (index: number) => {
    if (choices.length <= 2) return;

    const removedValue = choices[index];
    const updated = choices.filter((_, i) => i !== index);

    setChoices(updated);

    if (correctAnswer === removedValue) {
      setCorrectAnswer("");
    }
  };

  const noDuplicates = () => {
    const duplicates = choices.filter(
      (value, index) =>
        choices.indexOf(value) !== index && choices.lastIndexOf(value) === index
    );
    if (duplicates.length > 0) {
      return false;
    }
    return true;
  };

  const isValid =
    questionText.trim().length > 0 &&
    choices.length >= 2 &&
    choices.length <= 5 &&
    choices.every((c) => c.trim().length > 0) &&
    noDuplicates() &&
    correctAnswer.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onAddQuestion({
      question: questionText.trim(),
      choices: choices.map((c) => c.trim()),
      answer: correctAnswer.trim()
    });
    setErrorMessage("");
    setQuestionText("");
    setChoices(["", ""]);
    setCorrectAnswer("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 bg-white rounded-2xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold">Add Question (1-30)</h2>
      <div>
        <label className="block mb-1 font-medium">
          Question *
          <input
            type="text"
            value={questionText}
            maxLength={200}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter question text"
          />
        </label>
      </div>
      <div className="space-y-3">
        <label className="block font-medium">Choices (2-5) *</label>
        <p>Mark one of the choices as the correct one</p>
        <p>The order of choices will be shuffled</p>

        {choices.map((choice, index) => (
          <div key={index} className="flex items-center gap-3 max-w-full">
            <input
              type="radio"
              name="correctAnswer"
              checked={correctAnswer === choice}
              disabled={!choice.trim()}
              onChange={() => setCorrectAnswer(choice)}
            />

            <input
              type="text"
              value={choice}
              maxLength={200}
              onChange={(e) => handleChoiceChange(index, e.target.value)}
              className="flex-1 border max-w-50 md:max-w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Choice ${index + 1}`}
            />

            {choices.length > 2 && (
              <button
                type="button"
                onClick={() => removeChoice(index)}
                className="cursor-pointer text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {choices.length < 5 && (
          <button
            type="button"
            onClick={addChoice}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            + Add choice
          </button>
        )}
      </div>
      <p className="text-red-600">{errorMessage}</p>
      <button
        type="submit"
        disabled={!isValid}
        className={isValid ? "btn btn-blue" : "btn-blue-disabled"}
      >
        Add Question
      </button>
    </form>
  );
};

export default QuestionForm;
