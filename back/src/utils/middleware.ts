import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import z from "zod";
import config from "./config";
import { Token } from "../types/types";
import { UserModel } from "../models/userModel";

export const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(`${error.name}: ${error.message}`);

  if (error.name === "CastError") {
    return res.status(400).json({
      error: `Malformatted id: ${error.message}`
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  if (error.name === "ReferenceError") {
    return res.status(404).json({ error: error.message });
  }

  if (error.name === "InvalidIdError") {
    return res.status(400).json({ error: error.message });
  }

  if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return res.status(400).json({
      error: "Username already in use"
    });
  }

  if (error.message.includes("Username or password is incorrect")) {
    return res.status(401).json({
      error: "Username or password is incorrect"
    });
  }

  if (error instanceof z.ZodError) {
    return res.status(400).json({
      error: error.issues[0].message
    });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Token missing or invalid"
    });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token expired"
    });
  }

  return res.status(500).json({
    error: "Something went wrong"
  });
};

export const extractToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  const secret = config.SECRET as string;
  const decodedToken = jwt.verify(token, secret) as Token;
  req.token = decodedToken;
  next();
};

export const extractUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await UserModel.findById(req.token?.id);
  if (!user) {
    res.status(400).json({ error: "UserId missing or not valid" });
    return;
  }
  req.user = user;
  next();
};
