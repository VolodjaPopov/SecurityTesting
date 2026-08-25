import { test } from "../../modules/base";
import pages from "../../fixtures/pages.json";
import htmlPatterns from "../../fixtures/htmlInjectionPatterns.json";

test.describe("HTML Injection tests (Medium security)", () => {
  test.beforeEach(async ({ login }) => {
    await test.step("Log in with medium security level", async () => {
      await login.loginUser({ securityLevel: "medium" });
    });
  });

  test(
    "Medium - Reflected GET (Field entry)",
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
    "Medium - Reflected GET (URL entry)",
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
    "Medium - Reflected POST",
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

  /* There is an issue with bWAPP where medium security is the same as high for this page.
     This test will then insted show that basic (and even advanced) injection patterns do not work for this level. */

  test(
    "Medium - Stored (Blog)",
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
