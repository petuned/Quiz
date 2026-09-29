import { test as teardown } from "@playwright/test";

teardown("delete database", async ({}) => {
  try {
    await fetch("http://localhost:3000/api/testing/reset", {
      method: "POST"
    });
  } catch (e) {
    console.error(e);
  }
});
