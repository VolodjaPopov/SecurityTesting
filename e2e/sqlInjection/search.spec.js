import { test } from "../../modules/base";
import sqlPatterns from "../../fixtures/sqlInjectionPatterns.json";
import pages from "../../fixtures/pages.json";

let page;

test.describe("SQL Injection tests", () => {
  test.beforeEach(async ({ wpage, login }) => {
    page = wpage;
    await login.loginUser({});
  });

  test("Search GET", async ({ sqlInjection }) => {
    await page.goto(
      `${process.env.BASE_URL}${pages.defaultPages.sqlInjectionGetSearch}`
    );
    await sqlInjection.verifySearchField();
  });

  test("Search GET (URL Injection)", async ({ sqlInjection }) => {
    await page.goto(
      `${process.env.BASE_URL}${pages.defaultPages.sqlInjectionGetSearch}`
    );
    await sqlInjection.verifyURLInjections({
      patterns: sqlPatterns.injectionsForGetString,
      parameter: "title",
      submitValid: pages.validGETRequestPages.getSearchValidOption,
    });
  });

  test("Seach POST", async ({ sqlInjection }) => {
    await page.goto(
      `${process.env.BASE_URL}${pages.defaultPages.sqlInjectionPostSearch}`
    );
    await sqlInjection.verifySearchField();
  });

  test("Select GET", async ({ sqlInjection }) => {
    await page.goto(
      `${process.env.BASE_URL}${pages.defaultPages.sqlInjectionGetSelect}`
    );
    await sqlInjection.verifyURLInjections({});
  });
});
