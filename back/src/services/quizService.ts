import mongoose from "mongoose";
import { UserQuizModel } from "../models/userQuizModel";
import { NewQuiz } from "../types/types";

const addQuiz = async (quiz: NewQuiz, userId: mongoose.Types.ObjectId) => {
  const newQuiz = new UserQuizModel({
    ...quiz,
    userId
  });
  const savedQuiz = await newQuiz.save();
  return savedQuiz;
};

export default { addQuiz };
