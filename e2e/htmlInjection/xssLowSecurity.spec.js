import { expect, test } from "../../modules/base";
import pages from "../../fixtures/pages.json";
import htmlPatterns from "../../fixtures/htmlInjectionPatterns.json";

test.describe("XSS tests (Low security)", () => {
  let newId;
  let newText;

  test.beforeEach(async ({ generalFunctions, login }) => {
    newId = await generalFunctions.generateRandomString(5);
    newText = await generalFunctions.generateRandomString(5);

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
      await test.step("Go to the 'XSS Reflected (GET)' page", async () => {
        await generalFunctions.visitPage(pages.defaultPages.xssGet);
      });

      await test.step("Verify and log XSS for this page (by entering injections into the 'first name' field)", async () => {
        await htmlInjection.verifyNameFields({
          firstName: await htmlInjection.injectHTMLCodeAsString({
            elementId: newId,
            textContent: newText,
          }),
          expectedTag: "script",
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
      await test.step("Go to the 'XSS Reflected (GET)' page", async () => {
        await generalFunctions.visitPage(pages.defaultPages.xssGet);
      });

      await test.step("Verify and log XSS for this page (by entering injections into the URL)", async () => {
        await htmlInjection.verifyURLInjections({
          firstName: await htmlInjection.injectHTMLCodeAsString({
            elementId: newId,
            textContent: newText,
          }),
          expectedTag: "script",
          newId,
          newText,
        });
      });
    }
  );

  test(
    "Low - Reflected POST",
    {
      tag: ["@security", "@xss"],
    },
    async ({ generalFunctions, htmlInjection }) => {
      await test.step("Go to the 'XSS Reflected (POST)' page", async () => {
        await generalFunctions.visitPage(pages.defaultPages.xssPost);
      });

      await test.step("Verify and log XSS for this page (by entering injections into the 'first name' field)", async () => {
        await htmlInjection.verifyNameFields({
          firstName: await htmlInjection.injectHTMLCodeAsString({
            elementId: newId,
            textContent: newText,
          }),
          expectedTag: "script",
          newId,
          newText,
        });
      });
    }
  );

  test(
    "Low - Reflected JSON",
    {
      tag: ["@security", "@xss"],
    },
    async ({
      generalFunctions,
      htmlInjection,
      sqlInjection,
      commonActions,
    }) => {
      await test.step("Go to the 'XSS Reflected (JSON)' page", async () => {
        await generalFunctions.visitPage(pages.defaultPages.xssJson);
      });

      await test.step("Fill search field with Injection", async () => {
        let alertScript = await htmlInjection.wrapTag({
          value: htmlPatterns.noWrapping.scripts.alert,
          tag: "script",
        });
        let pattern = await htmlInjection.closeHTMLTagPreValue({
          tag: "script",
          value: alertScript[0],
        });
        await sqlInjection.movieSearchField.fill(pattern);
      });

      await test.step("Verify if alert has triggered and log appropriate response", async () => {
        let alert = await commonActions.verifyAlertDialog(
          await sqlInjection.searchButton.click()
        );
        await expect(alert).toBe(false);
      });
    }
  );

  test(
    "Low - Reflected Login",
    {
      tag: ["@security", "@xss"],
    },
    async ({ generalFunctions, htmlInjection, commonActions, login }) => {
      let pattern;

      await test.step("Go to the 'XSS Reflected (Login)' page", async () => {
        await generalFunctions.visitPage(pages.defaultPages.xssLogin);
      });

      await test.step("Generate XXS for login", async () => {
        let wrappedPattern = await htmlInjection.wrapTag({
          value: htmlPatterns.noWrapping.scripts.alert,
          tag: "script",
        });
        pattern = `${htmlPatterns.noWrapping.preScriptHTML}${wrappedPattern[0]}`;
      });

      await test.step("Check if alert pops up after entering the payload and log appropriate message", async () => {
        let dialogExists = await commonActions.verifyAlertDialog(
          await login.loginUser({
            username: pattern,
            goToPage: false,
            success: false,
            securityLevel: null,
          })
        );
        await expect(dialogExists).toBe(false);
      });
    }
  );

  test(
    "Low - Reflected HREF",
    {
      tag: ["@security", "@xss"],
    },
    async ({ generalFunctions, htmlInjection, commonActions }) => {
      await test.step("Go to the 'XSS Reflected (HREF)' page", async () => {
        await generalFunctions.visitPage(pages.defaultPages.xssHref);
      });

      await test.step("Enter script injection into name field", async () => {
        let alertScript = await htmlInjection.wrapTag({
          value: htmlPatterns.noWrapping.scripts.alert,
          tag: "script",
        });
        let pattern = await htmlInjection.closeHTMLTagPreValue({
          tag: "a",
          value: alertScript[0],
        });
        await htmlInjection.voteName.fill(pattern);
      });

      await test.step("Verify alert dialog and log message", async () => {
        let dialog = await commonActions.verifyAlertDialog(
          await htmlInjection.continueButton.click()
        );
        await expect(dialog).toBe(false);
      });
    }
  );
});
