import { test } from "../../modules/base";
import pages from "../../fixtures/pages.json";

test.describe("XSS tests (Low security)", () => {
  test.beforeEach(async ({ login }) => {
    await test.step("Log in with low security level", async () => {
      await login.loginUser({});
    });
  });

  test(
    "Low - Reflected GET (Field entry)",
    {
      tag: ["@security", "@xss"],
    },
    async ({ generalFunctions, htmlInjection }) => {
      let newId = await generalFunctions.generateRandomString(5);
      let newText = await generalFunctions.generateRandomString(5);
      await test.step("Go to the 'HTML Injection Reflected (GET)' page", async () => {
        await generalFunctions.visitPage(pages.defaultPages.xssGet);
      });

      await test.step("Verify and log HTML injections for this page (by entering injections into the 'first name' field)", async () => {
        await htmlInjection.verifyNameFields({
          firstName: await htmlInjection.injectHTMLCodeAsString({
            elementId: newId,
            textContent: newText,
          }),
          expectedInjection: "script",
          newId,
          newText,
        });
      });
    }
  );

  test(
    "Low - Reflected GET (URL entry)",
    {
      tag: ["@security", "@xss"],
    },
    async ({ generalFunctions, htmlInjection }) => {
      await test.step("Go to the 'HTML Injection Reflected (GET)' page", async () => {
        await generalFunctions.visitPage(pages.defaultPages.xssGet);
      });

      await test.step("Verify and log HTML injections for this page (by entering injections into the URL)", async () => {
        await htmlInjection.verifyURLInjections({});
      });
    }
  );

  test(
    "Low - Reflected POST",
    {
      tag: ["@security", "@xss"],
    },
    async ({ generalFunctions, htmlInjection }) => {
      await test.step("Go to the 'HTML Injection Reflected (POST)' page", async () => {
        await generalFunctions.visitPage(pages.defaultPages.xssPost);
      });

      await test.step("Verify and log HTML injections for this page (by entering injections into the 'first name' field)", async () => {
        await htmlInjection.verifyNameFields({});
      });
    }
  );
});
