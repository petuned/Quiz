import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../store";
import type { User, Quiz, NewQuiz } from "../../types";
import { changeNotification, setTimedNotification } from "./notificationReducer";
import userService from "../../services/userService";
import storageService from "../../services/storageService";
import quizService from "../../services/quizService";
import { getErrorMessage } from "../../utils";
import { selectUser } from "../selectors";

type UserState = {
  user: User | null;
  quizzes: Quiz[];
};

const initialState: UserState = {
  user: null,
  quizzes: []
};

export const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser() {
      return initialState;
    },
    setUserQuizList(state, action) {
      state.quizzes = action.payload;
    },
    addQuiz(state, action) {
      state.quizzes.push(action.payload);
    },
    deleteQuiz(state, action) {
      return {
        ...state,
        quizzes: state.quizzes.filter((quiz) => quiz._id !== action.payload)
      };
    },
    editQuiz(state, action) {
      return {
        ...state,
        quizzes: state.quizzes.map((quiz) =>
          quiz._id === action.payload._id ? action.payload : quiz
        )
      };
    }
  }
});

export const loginUser = (username: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(changeNotification("Logging in..."));
      const user: User = await userService.login(username, password);
      if (user) {
        storageService.addUser("quizAppUser", user);

        dispatch(setUser(user));
        dispatch(changeNotification(null));
        return user;
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      dispatch(setTimedNotification(message));
      return false;
    }
  };
};

export const registerUser = (username: string, password: string, name: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(changeNotification("Registration in progress..."));
      const user: User = await userService.register(username, password, name);
      if (user) {
        storageService.addUser("quizAppUser", user);

        dispatch(setUser(user));
        dispatch(changeNotification(null));
        return true;
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      dispatch(setTimedNotification(message));
      return false;
    }
  };
};

export const fetchUserQuizzes = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const user = selectUser(getState());
      if (!user) {
        throw new Error("User not found");
      }
      dispatch(changeNotification("Fetching quizzes..."));
      const data = await quizService.getUserQuizzes(user);
      if (data) {
        dispatch(setUserQuizList(data));
        dispatch(changeNotification(null));
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      if (axios.isAxiosError(error)) {
        if (error.status === 401) {
          dispatch(setTimedNotification("Session expired, new login is required"));
          dispatch(clearUser());
          storageService.removeUser("quizAppUser");
        } else {
          dispatch(setTimedNotification(message));
        }
      } else {
        dispatch(setTimedNotification(message));
      }
    }
  };
};

export const addUserQuiz = (newQuiz: NewQuiz) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const user = selectUser(getState());
      if (!user) {
        throw new Error("User not found");
      }
      dispatch(changeNotification("Saving the quiz..."));
      const quiz = await quizService.createQuiz(newQuiz, user);
      if (quiz) {
        dispatch(addQuiz(quiz));
        dispatch(setTimedNotification(`New quiz "${quiz.name}" added!`, 3));
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      if (axios.isAxiosError(error)) {
        if (error.status === 401) {
          dispatch(setTimedNotification("Session expired, new login is required"));
          dispatch(clearUser());
          storageService.removeUser("quizAppUser");
        } else {
          dispatch(setTimedNotification(message));
        }
      } else {
        dispatch(setTimedNotification(message));
      }
    }
  };
};

export const deleteUserQuiz = (id: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const user = selectUser(getState());
      if (!user) {
        throw new Error("User not found");
      }
      await quizService.deleteQuiz(id, user);
      dispatch(deleteQuiz(id));
      dispatch(setTimedNotification("Quiz deleted", 3));
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      if (axios.isAxiosError(error)) {
        if (error.status === 401) {
          dispatch(setTimedNotification("Session expired, new login is required"));
          dispatch(clearUser());
          storageService.removeUser("quizAppUser");
        } else {
          dispatch(setTimedNotification(message));
        }
      } else {
        dispatch(setTimedNotification(message));
      }
    }
  };
};

export const editUserQuiz = (id: string, quiz: NewQuiz) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const user = selectUser(getState());
      if (!user) {
        throw new Error("User not found");
      }
      dispatch(changeNotification("Saving the quiz..."));
      const updatedQuiz = await quizService.updateQuiz(id, quiz, user);
      if (updatedQuiz) {
        dispatch(editQuiz(updatedQuiz));
        dispatch(setTimedNotification(`Quiz "${updatedQuiz.name}" updated!`, 3));
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      if (axios.isAxiosError(error)) {
        if (error.status === 401) {
          dispatch(setTimedNotification("Session expired, new login is required"));
          dispatch(clearUser());
          storageService.removeUser("quizAppUser");
        } else {
          dispatch(setTimedNotification(message));
        }
      } else {
        dispatch(setTimedNotification(message));
      }
    }
  };
};

export const { setUser, clearUser, setUserQuizList, addQuiz, deleteQuiz, editQuiz } =
  userSlice.actions;

export default userSlice.reducer;
