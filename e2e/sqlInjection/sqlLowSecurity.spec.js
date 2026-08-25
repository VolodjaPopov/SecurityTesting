import { log, test } from "../../modules/base";
import sqlPatterns from "../../fixtures/sqlInjectionPatterns.json";
import pages from "../../fixtures/pages.json";
import messages from "../../fixtures/messages.json";

test.describe("SQL Injection tests (Low Security)", () => {
  test.beforeEach(async ({ login }) => {
    await test.step("Log in with low security level", async () => {
      await login.loginUser({});
    });
  });

  test(
    "Low - Search GET",
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
    "Low - Search GET (URL Injection)",
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
    "Low - Seach POST",
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
    "Low - Select GET",
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
    "Low - Blind Boolean",
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
    "Low - Stored (Blog)",
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

  test(
    "Low - Select POST",
    {
      tag: ["@security", "@sqlInjection"],
    },
    async ({ generalFunctions, commonActions, sqlInjection }) => {
      await test.step("Go to the 'SQL Injection POST/Search' page", async () => {
        await generalFunctions.visitPage(
          pages.defaultPages.sqlInjectionPostSelect
        );
      });

      await test.step("Run the function to intercept and change the POST request which returns a movie", async () => {
        await sqlInjection.interceptAndModifyPostRequest({
          optionToReplace: "3",
        });
      });

      await test.step("Select the movie for which the request will be intercepted", async () => {
        await sqlInjection.selectMovieOption("3");
      });

      await test.step("Verify the movie returned", async () => {
        let movieReturned = await sqlInjection.returnMovieTitleFromTable();
        if (movieReturned === (await commonActions.convertMovieIdToTitle(3)))
          log.info(messages.customMessages.sqlInjectionFalse);
        else if (
          movieReturned === (await commonActions.convertMovieIdToTitle(1))
        )
          log.warn(messages.customMessages.sqlInjectionInterceptedTrue);
        else
          log.caution(messages.customMessages.sqlInjectionInterceptedCaution);
      });
    }
  );
});
