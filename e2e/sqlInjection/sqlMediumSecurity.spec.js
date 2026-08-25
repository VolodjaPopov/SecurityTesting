import { test } from "../../modules/base";
import sqlPatterns from "../../fixtures/sqlInjectionPatterns.json";
import pages from "../../fixtures/pages.json";

/* In this file some tests are vulnerable to SQL Injections for this security level, but most
   are not. These tests have been left to show that basic and more advanced SQL Injection patterns 
   do not work for well secured apps. */

test.describe("SQL Injection tests (Medium Security)", () => {
  test.beforeEach(async ({ login }) => {
    await test.step("Log in with medium security level", async () => {
      await login.loginUser({ securityLevel: "medium" });
    });
  });

  test(
    "Medium - Search GET",
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
    "Medium - Search GET (URL Injection)",
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
    "Medium - Seach POST",
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

  test(
    "Medium - Select GET",
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
    "Medium - Blind Boolean",
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
    "Medium - Stored (Blog)",
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
