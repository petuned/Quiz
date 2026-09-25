const user = {
  username: "TestiTyyppi",
  name: "Testari",
  password: "Testaamistavarten1"
};

const quiz = {
  category: "User",
  subcategory: "TV",
  name: "Outlander",
  description: "Small 2 question quiz for testing purposes",
  questions: [
    {
      question: "Who is the main female character in the series?",
      choices: ["Claire", "Laoghaire", "Myrcella"],
      answer: "Claire"
    },
    {
      question: "Who is the main male character?",
      choices: ["Jamie", "Frank", "Murtagh"],
      answer: "Jamie"
    }
  ]
};

const newQuiz = {
  category: "User",
  subcategory: "TV",
  name: "Yellowstone",
  description: "Tiny quiz for testing purposes",
  questions: [
    {
      question: "What family is the series focused on?",
      choices: ["The Duttons", "The Frasers"],
      answer: "The Duttons"
    }
  ]
};

// Unique name for parallel testing
export const generateName = () => {
  return `${newQuiz.name} ${crypto.randomUUID()}`;
};

export default { user, quiz, newQuiz };
