import { test } from "../../modules/base";
import pages from "../../fixtures/pages.json";

test.describe("HTML Injection tests (Low security)", () => {
  test.beforeEach(async ({ login }) => {
    await test.step("Log in with low security level", async () => {
      await login.loginUser({});
    });
  });

  test(
    "Low - Reflected GET (Field entry)",
    {
      tag: ["@security", "@htmlInjection"],
    },
    async ({ generalFunctions, htmlInjection }) => {
      await test.step("Go to the 'HTML Injection Reflected (GET)' page", async () => {
        await generalFunctions.visitPage(
          pages.defaultPages.htmlInjectionReflectedGet
        );
      });

      await test.step("Verify and log HTML injections for this page (by entering injections into the 'first name' field)", async () => {
        await htmlInjection.verifyNameFields({});
      });
    }
  );

  test(
    "Low - Reflected GET (URL entry)",
    {
      tag: ["@security", "@htmlInjection"],
    },
    async ({ generalFunctions, htmlInjection }) => {
      await test.step("Go to the 'HTML Injection Reflected (GET)' page", async () => {
        await generalFunctions.visitPage(
          pages.defaultPages.htmlInjectionReflectedGet
        );
      });

      await test.step("Verify and log HTML injections for this page (by entering injections into the URL)", async () => {
        await htmlInjection.verifyURLInjections({});
      });
    }
  );

  test(
    "Low - Reflected POST",
    {
      tag: ["@security", "@htmlInjection"],
    },
    async ({ generalFunctions, htmlInjection }) => {
      await test.step("Go to the 'HTML Injection Reflected (POST)' page", async () => {
        await generalFunctions.visitPage(
          pages.defaultPages.htmlInjectionReflectedPost
        );
      });

      await test.step("Verify and log HTML injections for this page (by entering injections into the 'first name' field)", async () => {
        await htmlInjection.verifyNameFields({});
      });
    }
  );

  test(
    "Low - Stored (Blog)",
    {
      tag: ["@security", "@htmlInjection"],
    },
    async ({ generalFunctions, htmlInjection }) => {
      await test.step("Go to the 'HTML Injection - Stored (Blog) page", async () => {
        await generalFunctions.visitPage(
          pages.defaultPages.htmlInjectionStored
        );
      });

      await test.step("Verify and log HTML Injections for the table", async () => {
        await htmlInjection.verifyTableEntryInjection({});
      });
    }
  );
});
