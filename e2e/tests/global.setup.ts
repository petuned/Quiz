import { test as setup, request } from "@playwright/test";
import testdata from "../utils";

setup("initialize the database", async ({}) => {
  console.log("creating a user with a quiz");
  try {
    const requestContext = await request.newContext();
    const userRes = await requestContext.post(
      "http://localhost:3000/api/user/register",
      {
        data: testdata.user
      }
    );
    const user = await userRes.json();
    await requestContext.post("http://localhost:3000/api/quiz/", {
      data: testdata.quiz,
      headers: { Authorization: `Bearer ${user.token}` }
    });
  } catch (e) {
    console.error(e);
  }
});
