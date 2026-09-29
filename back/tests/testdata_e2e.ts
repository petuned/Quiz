const password = "Testaamistavarten1";

const users = ["chromium", "firefox", "webkit"];

const quizzes = [
  {
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
  },
  {
    category: "User",
    subcategory: "Video Games",
    name: "Nier Automata",
    description: "Tiny quiz for testing purposes",
    questions: [
      {
        question: "Who is the creative director of Nier Automata?",
        choices: ["Yoko Taro", "Neil Druckmann", "Hideo Kojima"],
        answer: "Yoko Taro"
      }
    ]
  },
  {
    category: "User",
    subcategory: "Books",
    name: "The Good Daughter",
    description:
      "The stunning new novel from the international #1 bestselling author — a searing, spellbinding blend of cold-case thriller and psychological suspense.",
    questions: [
      {
        question: "Who is the author of the book?",
        choices: ["Karin Slaughter", "Gillian Flynn", "Agatha Christie"],
        answer: "Karin Slaughter"
      },
      {
        question: "Who are the main characters?",
        choices: ["Jamie and Claire", "Holmes and Watson", "Samantha and Charlotte"],
        answer: "Samantha and Charlotte"
      }
    ]
  }
];

export default { password, users, quizzes };
