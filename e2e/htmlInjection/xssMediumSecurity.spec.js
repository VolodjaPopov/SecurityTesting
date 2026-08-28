import { expect, test } from "../../modules/base";
import pages from "../../fixtures/pages.json";
import htmlPatterns from "../../fixtures/htmlInjectionPatterns.json";

test.describe("XSS tests (Medium security)", () => {
  let newId;
  let newText;

  test.beforeEach(async ({ generalFunctions, login }) => {
    newId = await generalFunctions.generateRandomString(5);
    newText = await generalFunctions.generateRandomString(5);

    await test.step("Log in with medium security level", async () => {
      await login.loginUser({ securityLevel: "medium" });
    });
  });

  test(
    "Medium - Reflected GET (Field entry)",
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
    "Medium - Reflected GET (URL entry)",
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
    "Medium - Reflected POST",
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
    "Medium - Reflected JSON",
    {
      tag: ["@security", "@xss"],
    },
    async ({ generalFunctions, htmlInjection, sqlInjection }) => {
      await test.step("Go to the 'XSS Reflected (JSON)' page", async () => {
        await generalFunctions.visitPage(pages.defaultPages.xssJson);
      });

      await test.step("Fill search field with Injection", async () => {
        let pattern = await htmlInjection.wrapTagJsonEndScript(
          await htmlInjection.injectHTMLCodeAsString({
            elementId: newId,
            textContent: newText,
          })
        );

        await sqlInjection.movieSearchField.fill(pattern);
        await sqlInjection.searchButton.click();
      });

      await test.step("Verify and log if added script was successfully executed", async () => {
        await htmlInjection.verifyNewlyAddedField(newId, newText);
      });
    }
  );

  test(
    "Medium - Reflected Login",
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
});
