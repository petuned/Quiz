import express from "express";
import quizRouter from "./routes/quiz";
import userRouter from "./routes/user";
import testingRouter from "./routes/testing";
import mongoose from "mongoose";
import { unknownEndpoint, errorMiddleware } from "./utils/middleware";
import config from "./utils/config";

const app = express();
app.use(express.static("dist"));
app.use(express.json());

mongoose.set("strictQuery", false);

if (!config.MONGODB_URI) {
  throw new Error("Database URL not found");
} else {
  mongoose
    .connect(config.MONGODB_URI, { family: 4 })
    .then(() => {
      console.log("connected to MongoDB");
    })
    .catch((error) => {
      console.log("error connecting to MongoDB:", error);
    });
}

app.use("/api/user", userRouter);
app.use("/api/quiz", quizRouter);
if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
}
app.use(unknownEndpoint);
app.use(errorMiddleware);

export default app;
