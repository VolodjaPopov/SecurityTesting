import { test } from "../../modules/base";
import pages from "../../fixtures/pages.json";

let page;

test.describe("SQL Injection tests", () => {
  test.beforeEach(async ({ wpage, login }) => {
    page = wpage;
    await login.loginUser({});
  });

  test("Login Form - Hero", async ({ login }) => {
    await page.goto(`${process.env.BASE_URL}${pages.defaultPages.loginHero}`);
    await login.verifyLoginPageInjections({});
  });
});
