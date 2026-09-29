import { TestInfo } from "@playwright/test";

export function getTestUser(testInfo: TestInfo) {
  return {
    username: testInfo.project.name,
    name: testInfo.project.name,
    password: "Testaamistavarten1"
  };
}

const existingQuizInfo = {
  name: "Outlander"
};

const newQuiz = {
  category: "User",
  subcategory: "TV",
  name: "Yellowstone",
  description: "An American neo-Western drama television series",
  questions: [
    {
      question: "What family is the series focused on?",
      choices: ["The Duttons", "The Frasers"],
      answer: "The Duttons"
    }
  ]
};

const mutableQuizInfo = {
  name: "Nier Automata",
  newDescription:
    "NieR: Automata tells the story of androids 2B, 9S and A2 and their battle to reclaim the machine-driven dystopia overrun by powerful machines."
};

const deletableQuizInfo = {
  name: "The Good Daughter"
};

export default { existingQuizInfo, newQuiz, mutableQuizInfo, deletableQuizInfo };
