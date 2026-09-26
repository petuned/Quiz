import axios from "axios";
import type { Quiz, NewQuiz, User } from "../types";

const getAllQuizzes = async () => {
  const response = await axios.get<Quiz[]>("/api/quiz");
  return response.data;
};

const getUserQuizzes = async (user: User) => {
  const config = {
    headers: { Authorization: `Bearer ${user.token}` }
  };

  const response = await axios.get<Quiz[]>("/api/quiz/userquizzes", config);
  return response.data;
};

const createQuiz = async (quiz: NewQuiz, user: User) => {
  const config = {
    headers: { Authorization: `Bearer ${user.token}` }
  };
  const response = await axios.post<NewQuiz>("/api/quiz/userquizzes", quiz, config);
  return response.data;
};

const deleteQuiz = async (id: string, user: User) => {
  const config = {
    headers: { Authorization: `Bearer ${user.token}` }
  };
  const response = await axios.delete(`/api/quiz/userquizzes/${id}`, config);
  return response;
};

const updateQuiz = async (id: string, quiz: NewQuiz, user: User) => {
  const config = {
    headers: { Authorization: `Bearer ${user.token}` }
  };
  const response = await axios.put(`/api/quiz/userquizzes/${id}`, quiz, config);
  return response.data;
};

export default { getAllQuizzes, getUserQuizzes, createQuiz, deleteQuiz, updateQuiz };
