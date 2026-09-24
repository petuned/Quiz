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

export default { user, quiz };
