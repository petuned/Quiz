import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectGroupedQuizzesByCategory } from "../../store/selectors";

interface Props {
  category: string;
  selectQuiz(_id: string): void;
}

const headings: Record<string, string> = {
  Education: "Education",
  Entertainment: "Entertainment",
  General: "General Knowledge",
  User: "My Quizzes"
};

const QuizList = ({ category, selectQuiz }: Props) => {
  const grouped = useAppSelector(selectGroupedQuizzesByCategory(category));

  return (
    <div className="min-h-screen h-fit p-2 md:p-4 bg-white">
      {grouped && (
        <div className="px-4">
          <h1 className="md:hidden pb-4 text-2xl font-semibold">
            {headings[category]}{" "}
          </h1>{" "}
          {Object.entries(grouped).map(([subcategory, quizzes], i) => (
            <div key={i}>
              <h2 className="pt-3 wrap-anywhere text-xl font-semibold">
                {subcategory}
              </h2>
              <div className="flex gap-3 py-3 overflow-x-auto">
                {quizzes.map((el, j) => (
                  <div
                    key={j}
                    onClick={() => selectQuiz(el._id)}
                    className="cursor-pointer flex items-center justify-center min-w-50 max-w-70 h-30 overflow-hidden wrap-anywhere px-2 bg-indigo-500 hover:bg-blue-700 shadow-md hover:shadow-xl rounded-2xl text-center"
                  >
                    <p className="text-white text-base lg:text-lg">{el.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {Object.keys(grouped).length === 0 && category === "User" && (
        <p className="pt-5 text-center">
          No quizzes created,{" "}
          <Link to="/create" style={{ textDecoration: "underline" }}>
            create one here
          </Link>
        </p>
      )}
    </div>
  );
};

export default QuizList;
