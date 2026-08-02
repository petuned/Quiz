import { z } from "zod";
import { NewUser, NewQuiz } from "../types/types";

export const NewUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username has to be at least 3 characters long.")
    .max(20, "Username can't be more than 20 characters long.")
    .regex(
      /^[a-zA-Z0-9åÅäÄöÖ]{3,20}$/,
      "Username can only contain letters and numbers."
    ),
  name: z
    .string()
    .min(3, "Name has to be at least 3 characters long.")
    .max(20, "Name can't be more than 20 characters long.")
    .regex(
      /^(?=.*[A-Za-zÅÄÖåäö0-9])[A-Za-zÅÄÖåäö0-9 ]{3,20}$/,
      "Name can only contain letters, numbers and spaces."
    ),
  password: z
    .string()
    .min(14, "Password has to be at least 14 characters long.")
    .max(25, "Password can't be more than 25 characters long.")
    .regex(
      /^(?=.*[a-zåäö])(?=.*[A-ZÅÄÖ])(?=.*\d)\S{14,25}$/,
      "Password does not match requirements."
    )
});

export const QuestionSchema = z.object({
  question: z.string().min(1).max(200),
  choices: z
    .array(z.string().min(1).max(200))
    .refine((items) => new Set(items).size === items.length, {
      message: "Answer choices for question have to be unique"
    }),
  answer: z.string().min(1).max(200)
});

export const NewQuizSchema = z.object({
  category: z.string("User"),
  subcategory: z.string().min(1).max(60),
  name: z.string().min(1).max(90),
  description: z.string().min(1).max(450),
  questions: z.array(QuestionSchema).min(1).max(30)
});

export const parseUser = (
  username: unknown,
  name: unknown,
  password: unknown
): NewUser => {
  return NewUserSchema.parse({ username, name, password });
};

export const parseQuiz = (quiz: unknown): NewQuiz => {
  return NewQuizSchema.parse(quiz);
};
