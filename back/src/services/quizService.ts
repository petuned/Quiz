import mongoose from "mongoose";
import { InvalidIdError } from "../types/customErrors";
import { QuizModel } from "../models/quizModel";
import { UserQuizModel } from "../models/userQuizModel";
import { NewQuiz, Quiz } from "../types/types";
import { parseQuiz } from "../utils/utils";

const getQuizzes = async () => {
  const quizzes = await QuizModel.find({});
  return quizzes;
};

const addUserQuiz = async (quiz: NewQuiz, userId: mongoose.Types.ObjectId) => {
  const newQuiz = new UserQuizModel({
    ...quiz,
    userId
  });
  const savedQuiz = await newQuiz.save();
  return savedQuiz;
};

const getUserQuizzes = async (userId: mongoose.Types.ObjectId) => {
  const quizzes = await UserQuizModel.find({ userId: userId });
  return quizzes;
};

const editUserQuiz = async (
  quizId: string,
  userId: mongoose.Types.ObjectId,
  quiz: Quiz
) => {
  const previousQuiz = await UserQuizModel.findById(quizId);
  if (!previousQuiz) {
    throw new ReferenceError("The edited quiz was not found");
  }

  if (!previousQuiz.userId?.equals(userId)) {
    throw new InvalidIdError("userId not valid");
  }
  const validatedQuiz = parseQuiz(quiz);

  previousQuiz.name = validatedQuiz.name;
  previousQuiz.category = validatedQuiz.category;
  previousQuiz.subcategory = validatedQuiz.subcategory;
  previousQuiz.description = validatedQuiz.description;
  previousQuiz.questions = validatedQuiz.questions;

  const updatedQuiz = await previousQuiz.save();
  return updatedQuiz;
};

const deleteUserQuiz = async (quizId: string, userId: mongoose.Types.ObjectId) => {
  await UserQuizModel.findOneAndDelete({ _id: quizId, userId: userId });
};

export default {
  getQuizzes,
  addUserQuiz,
  getUserQuizzes,
  editUserQuiz,
  deleteUserQuiz
};
