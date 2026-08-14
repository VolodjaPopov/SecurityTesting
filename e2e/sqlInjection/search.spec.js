import { test } from "../../modules/base";
import pages from "../../fixtures/pages.json";

let page;

test.describe("SQL injection - GET Search", () => {
  test.beforeEach(async ({ wpage, login }) => {
    page = wpage;
    await login.loginUser({});
    await page.goto(
      `${process.env.BASE_URL}${pages.defaultPages.sqlInjectionGetSearch}`
    );
  });

  test("Seach GET", async ({ sqlInjection }) => {
    await sqlInjection.verifySearchField();
  });
});

test.describe("SQL injection - GET Select", () => {
  test.beforeEach(async ({ wpage, login }) => {
    page = wpage;
    await login.loginUser({});
    await page.goto(
      `${process.env.BASE_URL}${pages.defaultPages.sqlInjectionGetSelect}`
    );
  });

  test("Select GET", async ({ sqlInjection }) => {
    await sqlInjection.verifyURLInjections({});
  });
});
