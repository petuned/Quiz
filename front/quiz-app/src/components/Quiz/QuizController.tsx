import { useState } from "react";

import type { QuizDescription } from "../../types";
import { useIsDesktop } from "../../hooks";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { startQuiz } from "../../store/reducers/activeQuizReducer";
import { deleteUserQuiz } from "../../store/reducers/userReducer";
import { selectQuizMap } from "../../store/selectors";

import QuizList from "./QuizList";
import QuizOverlay from "./QuizOverlay";
import ActiveQuizController from "./ActiveQuiz/ActiveQuizController";
import CategoryNavDesktop from "./CategoryNavDesktop";
import CategoryNavMobile from "./CategoryNavMobile";
import NavBarDesktop from "../NavBarDesktop";
import NavBarMobile from "../NavBarMobile";

const QuizController = () => {
  const dispatch = useAppDispatch();
  const isActive = useAppSelector((state) => state.activeQuiz.isActive);
  const isDesktop = useIsDesktop();
  const quizMap = useAppSelector((state) => selectQuizMap(state));
  const [selectedQuiz, setSelectedQuiz] = useState<QuizDescription>({
    _id: "",
    category: "",
    subcategory: "",
    name: "",
    description: "",
    questions: 0
  });
  const [category, setCategory] = useState<string>("Entertainment");
  const [overlayIsOpen, setOverlayIsOpen] = useState<boolean>(false);

  const start = () => {
    const quiz = quizMap[selectedQuiz._id];
    if (quiz) {
      dispatch(startQuiz(quiz));
      setOverlayIsOpen(false);
    }
  };

  const handleSelect = (id: string) => {
    const quiz = quizMap[id];
    if (quiz) {
      setSelectedQuiz({
        ...quiz,
        questions: quiz.questions.length
      });
      setOverlayIsOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Do you really want to delete this quiz?")) {
      return;
    }
    const quiz = quizMap[id];
    if (quiz) {
      dispatch(deleteUserQuiz(quiz._id));
      setOverlayIsOpen(false);
    }
  };

  return isActive ? (
    <ActiveQuizController />
  ) : isDesktop ? (
    <div className="flex flex-row min-h-screen h-fit">
      <CategoryNavDesktop category={category} setCategory={setCategory} />
      <div className="w-[80%]">
        <NavBarDesktop />
        <QuizList category={category} selectQuiz={handleSelect} />
      </div>
      <QuizOverlay
        isOpen={overlayIsOpen}
        toggleOpen={setOverlayIsOpen}
        start={start}
        category={category}
        quiz={selectedQuiz}
        deleteQuiz={handleDelete}
      />
    </div>
  ) : (
    <div>
      <NavBarMobile />
      <CategoryNavMobile category={category} setCategory={setCategory} />
      <QuizList category={category} selectQuiz={handleSelect} />
      <QuizOverlay
        isOpen={overlayIsOpen}
        toggleOpen={setOverlayIsOpen}
        start={start}
        category={category}
        quiz={selectedQuiz}
        deleteQuiz={handleDelete}
      />
    </div>
  );
};

export default QuizController;
