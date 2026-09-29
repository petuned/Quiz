import express, { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
import quizService from "../services/quizService";
import { UserQuizModel } from "../models/userQuizModel";
import { UserModel } from "../models/userModel";
import testdata from "../../tests/testdata_e2e";

const router = express.Router();

router.post("/init", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Initializing the test db");
    testdata.users.forEach(async (user) => {
      const newUser = await userService.addUser({
        username: user,
        name: user,
        password: testdata.password
      });
      testdata.quizzes.forEach(async (quiz) => {
        await quizService.addUserQuiz(quiz, newUser._id);
      });
    });
    res.status(201).end();
  } catch (error) {
    next(error);
  }
});

router.post("/reset", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Resetting the test db");
    await UserQuizModel.deleteMany({});
    await UserModel.deleteMany({});
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
