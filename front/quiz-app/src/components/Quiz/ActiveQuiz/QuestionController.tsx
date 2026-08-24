import {
  useState,
  type SetStateAction,
  type Dispatch,
  type FormEvent,
  useEffect
} from "react";

import type { Quiz } from "../../../types";

import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import {
  setPlayerAnswer,
  updateScore
} from "../../../store/reducers/activeQuizReducer";

interface Props {
  setShowQuestion: Dispatch<SetStateAction<boolean>>;
}

const QuestionController = ({ setShowQuestion }: Props) => {
  const dispatch = useAppDispatch();
  const activeQuiz: Quiz = useAppSelector((state) => state.activeQuiz.quiz);
  const [answer, setAnswer] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [currentCorrectAnswer, setCurrentCorrectAnswer] = useState<string>("");

  const shuffleChoices = (choices: string[]) => {
    let currentIndex = choices.length,
      randomIndex;
    const shuffled = [...choices];

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [shuffled[currentIndex], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[currentIndex]
      ];
    }

    return shuffled;
  };

  useEffect(() => {
    setCurrentQuestion(activeQuiz.questions[currentIndex].question);
    const shuffledChoices = shuffleChoices(
      activeQuiz.questions[currentIndex].choices
    );
    setCurrentOptions(shuffledChoices);
    setCurrentCorrectAnswer(activeQuiz.questions[currentIndex].answer);
  }, [activeQuiz, currentIndex]);

  const handleAnswerSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(setPlayerAnswer(answer));
    if (answer === currentCorrectAnswer) {
      dispatch(updateScore());
    }
    const index = currentIndex + 1;
    if (index === activeQuiz.questions.length) {
      setShowQuestion(false);
    } else {
      setCurrentIndex(index);
    }
    setAnswer("");
  };

  const changeAnswer = (text: string) => {
    setAnswer(text);
  };

  return (
    <div className="flex flex-col items-center">
      <p className="wrap-anywhere my-4 text-base md:text-lg lg:text-xl">
        {currentIndex + 1}. {currentQuestion}
      </p>
      <form onSubmit={handleAnswerSubmit} className="m-2">
        {currentOptions.map((option, i) => (
          <div key={i} className="mb-3">
            <label>
              <input
                type="radio"
                name="option"
                checked={answer === option}
                onChange={() => changeAnswer(option)}
              />
              <p className="wrap-anywhere inline ml-2 text-base md:text-lg lg:text-xl">
                {option}
              </p>
            </label>
          </div>
        ))}
        <div className="text-center">
          {answer ? (
            <button type="submit" className="btn btn-blue">
              Next
            </button>
          ) : (
            <button disabled className="btn-blue-disabled">
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuestionController;
