import { test } from "../../modules/base";
import sqlPatterns from "../../fixtures/sqlInjectionPatterns.json";
import pages from "../../fixtures/pages.json";

/* In this file no fields are vulnerable to basic (and more advanced) SQL injections, tests will pass. */

test.describe("SQL Injection tests (High Security)", () => {
  test.beforeEach(async ({ login }) => {
    await test.step("Log in with high security level", async () => {
      await login.loginUser({ securityLevel: "high" });
    });
  });

  test(
    "High - Search GET",
    {
      tag: ["@security", "@sqlInjection"],
    },
    async ({ generalFunctions, sqlInjection }) => {
      await test.step("Go to the 'SQL Injection GET/Search' page", async () => {
        await generalFunctions.visitPage(
          pages.defaultPages.sqlInjectionGetSearch
        );
      });

      await test.step("Verify and log SQL injections for the 'Search movies' field", async () => {
        await sqlInjection.verifySearchField({});
      });
    }
  );

  test(
    "High - Search GET (URL Injection)",
    {
      tag: ["@security", "@sqlInjection"],
    },
    async ({ generalFunctions, sqlInjection }) => {
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
    }
  );

  test(
    "High - Seach POST",
    {
      tag: ["@security", "@sqlInjection"],
    },
    async ({ generalFunctions, sqlInjection }) => {
      await test.step("Go to the 'SQL Injection POST/Search' page", async () => {
        await generalFunctions.visitPage(
          pages.defaultPages.sqlInjectionPostSearch
        );
      });

      await test.step("Verify and log SQL injections for the 'Search movies' field", async () => {
        await sqlInjection.verifySearchField({});
      });
    }
  );

  // There seems to be a bug with bWAPP where this test is still vulnerable to injections, even on high level
  test(
    "High - Select GET",
    {
      tag: ["@security", "@sqlInjection"],
    },
    async ({ generalFunctions, sqlInjection }) => {
      await test.step("Go to the 'SQL Injection GET/Select' page", async () => {
        await generalFunctions.visitPage(
          pages.defaultPages.sqlInjectionGetSelect
        );
      });

      await test.step("Verify and log SQL injections using the URL", async () => {
        await sqlInjection.verifyURLInjections({});
      });
    }
  );

  test(
    "High - Blind Boolean",
    {
      tag: ["@security", "@sqlInjection"],
    },
    async ({ generalFunctions, sqlInjection }) => {
      await test.step("Go to the 'SQL Injection POST/Search' page", async () => {
        await generalFunctions.visitPage(
          pages.defaultPages.sqlInjectionBoolean
        );
      });

      await test.step("Verify and log SQL injections for the 'Search movies' field", async () => {
        await sqlInjection.verifySearchField({ messagesToCheck: "boolean" });
      });
    }
  );

  test(
    "High - Stored (Blog)",
    {
      tag: ["@security", "@sqlInjection"],
    },
    async ({ generalFunctions, htmlInjection }) => {
      await test.step("Go to the 'SQL Injection - Stored (Blog) page", async () => {
        await generalFunctions.visitPage(pages.defaultPages.sqlInjectionBlog);
      });

      await test.step("Verify and log HTML Injections for the table", async () => {
        await htmlInjection.verifyInjectedWriteScriptInTable({});
      });
    }
  );
});
