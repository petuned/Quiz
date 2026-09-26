import { test as setup } from "@playwright/test";

setup("initialize the database", async ({}) => {
  console.log("creating a user with a quiz");
  try {
    await fetch("http://localhost:3000/api/testing/init", {
      method: "POST"
    });
  } catch (e) {
    console.error(e);
  }
});
