import express, { Request, Response, NextFunction } from "express";
import { UserQuizModel } from "../models/userQuizModel";
import { UserModel } from "../models/userModel";

const router = express.Router();

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
