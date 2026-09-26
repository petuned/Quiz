import express, { Request, Response, NextFunction } from "express";
import quizService from "../services/quizService";
import { parseQuiz } from "../utils/utils";
import { extractToken, extractUser } from "../utils/middleware";
import { UserQuizModel } from "../models/userQuizModel";
import { QuizModel } from "../models/quizModel";

const router = express.Router();

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const quizzes = await QuizModel.find({});
    res.send(quizzes);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  extractToken,
  extractUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        console.log("Creating a new quiz");
        const quiz = req.body;
        const validatedQuiz = parseQuiz(quiz);
        const savedQuiz = await quizService.addQuiz(validatedQuiz, req.user._id);

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
        const userQuizzes = await UserQuizModel.find({ userId: req.user._id });
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
        const id = req.params.id;
        await UserQuizModel.findOneAndDelete({ _id: id, userId: req.user._id });
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
        const id = req.params.id;
        const previousQuiz = await UserQuizModel.findById(id);
        if (!previousQuiz) {
          res.status(404).json({ error: "The edited quiz was not found" });
          return;
        }

        if (!previousQuiz.userId?.equals(req.user._id)) {
          res.status(400).json({ error: "userId not valid" });
          return;
        }
        const newQuiz = req.body;
        const validatedQuiz = parseQuiz(newQuiz);

        previousQuiz.name = validatedQuiz.name;
        previousQuiz.category = validatedQuiz.category;
        previousQuiz.subcategory = validatedQuiz.subcategory;
        previousQuiz.description = validatedQuiz.description;
        previousQuiz.questions = validatedQuiz.questions;

        const updatedQuiz = await previousQuiz.save();
        res.json(updatedQuiz);
      }
    } catch (error: unknown) {
      next(error);
    }
  }
);
export default router;
