import { test, expect } from "../modules/base.js";

let page;

test.describe("Test describe", () => {
  test.beforeEach(async ({ wpage }) => {
    page = wpage;
  });

  test("Test test", async ({ login }) => {
    await login.loginUser({});
  });
});
