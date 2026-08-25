import { test } from "../../modules/base";
import pages from "../../fixtures/pages.json";
import htmlPatterns from "../../fixtures/htmlInjectionPatterns.json";

/* When set to high security level HTML Injections will not work, both normal and encoded
   All the tests in this spec file will pass, the expected outcome in any real app */

test.describe("HTML Injection tests (High security)", () => {
  test.beforeEach(async ({ login }) => {
    await test.step("Log in with medium security level", async () => {
      await login.loginUser({ securityLevel: "high" });
    });
  });

  test(
    "High - Reflected GET (Field entry)",
    {
      tag: ["@security", "@htmlInjection"],
    },
    async ({ generalFunctions, htmlInjection }) => {
      await test.step("Go to the 'HTML Injection Reflected (GET)' page", async () => {
        await generalFunctions.visitPage(
          pages.defaultPages.htmlInjectionReflectedGet
        );
      });

      await test.step("Verify unencoded injections don't work with this security level", async () => {
        await htmlInjection.verifyNameFields({});
      });

      await test.step("Verify HTML Injections with encoded requests", async () => {
        await htmlInjection.verifyNameFields({ encoded: true });
      });
    }
  );

  test(
    "High - Reflected GET (URL entry)",
    {
      tag: ["@security", "@htmlInjection"],
    },
    async ({ generalFunctions, htmlInjection }) => {
      await test.step("Go to the 'HTML Injection Reflected (GET)' page", async () => {
        await generalFunctions.visitPage(
          pages.defaultPages.htmlInjectionReflectedGet
        );
      });

      await test.step("Verify unencoded injections don't work with this security level", async () => {
        await htmlInjection.verifyURLInjections({});
      });

      await test.step("Verify HTML Injections with encoded requests (through URL)", async () => {
        await htmlInjection.verifyURLInjections({ encoded: true });
      });
    }
  );

  test(
    "High - Reflected POST",
    {
      tag: ["@security", "@htmlInjection"],
    },
    async ({ generalFunctions, htmlInjection }) => {
      await test.step("Go to the 'HTML Injection Reflected (POST)' page", async () => {
        await generalFunctions.visitPage(
          pages.defaultPages.htmlInjectionReflectedGet
        );
      });

      await test.step("Verify unencoded injections don't work with this security level", async () => {
        await htmlInjection.verifyNameFields({});
      });

      await test.step("Verify HTML Injections with encoded requests", async () => {
        await htmlInjection.verifyNameFields({ encoded: true });
      });
    }
  );

  test(
    "High - Stored (Blog)",
    {
      tag: ["@security", "@htmlInjection"],
    },
    async ({ generalFunctions, commonActions, htmlInjection }) => {
      await test.step("Go to the 'HTML Injection Reflected (POST)' page", async () => {
        await generalFunctions.visitPage(
          pages.defaultPages.htmlInjectionStored
        );
      });

      await test.step("Attempt to inject html div", async () => {
        await htmlInjection.verifyTableEntryInjection({});
      });

      await test.step("Attempt to inject HTML script", async () => {
        await htmlInjection.verifyInjectedWriteScriptInTable({});
      });

      await test.step("Attempt more advanced Injections", async () => {
        for (const pattern of htmlPatterns.withWrapping.scriptsArr) {
          await htmlInjection.verifyInjectionsInTableNoWrapping(pattern);
        }
      });

      await test.step("Clear all entries", async () => {
        await commonActions.clearBlogTable();
      });
    }
  );
});
