import express, { Request, Response, NextFunction } from "express";
import quizService from "../services/quizService";
import { parseQuiz } from "../utils/utils";
import { extractToken, extractUser } from "../utils/middleware";

const router = express.Router();

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const quizzes = await quizService.getQuizzes();
    res.send(quizzes);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/userquizzes",
  extractToken,
  extractUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        console.log("Creating a new quiz");
        const quiz = req.body;
        const validatedQuiz = parseQuiz(quiz);
        const savedQuiz = await quizService.addUserQuiz(validatedQuiz, req.user._id);

        res.status(201).json(savedQuiz);
      }
    } catch (error: unknown) {
      next(error);
    }
  }
);

router.get(
  "/userquizzes",
  extractToken,
  extractUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        console.log("Fetching user's quizzes");
        const userQuizzes = await quizService.getUserQuizzes(req.user._id);
        res.send(userQuizzes);
      }
    } catch (error: unknown) {
      next(error);
    }
  }
);

router.delete(
  "/userquizzes/:id",
  extractToken,
  extractUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        console.log("Deleting a user quiz");
        const quizId = req.params.id;
        const userId = req.user._id;
        await quizService.deleteUserQuiz(quizId, userId);
        res.status(204).end();
      }
    } catch (error: unknown) {
      next(error);
    }
  }
);

router.put(
  "/userquizzes/:id",
  extractToken,
  extractUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        const quizId = req.params.id;
        const userId = req.user._id;
        const quiz = req.body;
        const updatedQuiz = await quizService.editUserQuiz(quizId, userId, quiz);
        res.json(updatedQuiz);
      }
    } catch (error: unknown) {
      next(error);
    }
  }
);
export default router;
