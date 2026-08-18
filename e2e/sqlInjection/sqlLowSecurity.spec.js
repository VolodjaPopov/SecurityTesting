import { test } from "../../modules/base";
import sqlPatterns from "../../fixtures/sqlInjectionPatterns.json";
import pages from "../../fixtures/pages.json";

test.describe("SQL Injection tests (Low Security)", () => {
  test.beforeEach(async ({ login }) => {
    await test.step("Log in with low security level", async () => {
      await login.loginUser({});
    });
  });

  test("Search GET", async ({ generalFunctions, sqlInjection }) => {
    await test.step("Go to the 'SQL Injection GET/Search' page", async () => {
      await generalFunctions.visitPage(
        pages.defaultPages.sqlInjectionGetSearch
      );
    });

    await test.step("Verify and log SQL injections for the 'Search movies' field", async () => {
      await sqlInjection.verifySearchField();
    });
  });

  test("Search GET (URL Injection)", async ({
    generalFunctions,
    sqlInjection,
  }) => {
    await test.step("Go to the 'SQL Injection GET/Search' page", async () => {
      await generalFunctions.visitPage(
        pages.defaultPages.sqlInjectionGetSearch
      );
    });

    await test.step("Verify and log SQL injections using the URL", async () => {
      await sqlInjection.verifyURLInjections({
        patterns: sqlPatterns.injectionsForGetString,
        parameter: "title",
        submitValid: pages.validGETRequestPages.getSearchValidOption,
      });
    });
  });

  test("Seach POST", async ({ generalFunctions, sqlInjection }) => {
    await test.step("Go to the 'SQL Injection POST/Search' page", async () => {
      await generalFunctions.visitPage(
        pages.defaultPages.sqlInjectionPostSearch
      );
    });

    await test.step("Verify and log SQL injections for the 'Search movies' field", async () => {
      await sqlInjection.verifySearchField();
    });
  });

  test("Select GET", async ({ generalFunctions, sqlInjection }) => {
    await test.step("Go to the 'SQL Injection GET/Select' page", async () => {
      await generalFunctions.visitPage(
        pages.defaultPages.sqlInjectionGetSelect
      );
    });

    await test.step("Verify and log SQL injections using the URL", async () => {
      await sqlInjection.verifyURLInjections({});
    });
  });
});
