import { test } from "../../modules/base";
import pages from "../../fixtures/pages.json";

test.describe("HTML Injection tests (Medium security)", () => {
  test.beforeEach(async ({ login }) => {
    await test.step("Log in with medium security level", async () => {
      await login.loginUser({ securityLevel: "medium" });
    });
  });

  test("Reflected GET (Field entry)", async ({
    generalFunctions,
    htmlInjection,
  }) => {
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
  });

  test("Reflected GET (URL entry)", async ({
    generalFunctions,
    htmlInjection,
  }) => {
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
  });

  test("Reflected POST", async ({ generalFunctions, htmlInjection }) => {
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
  });

  // There is an issue with bWAPP where medium security is like high for this page, terefore this test is commented out

  // test("Stored (Blog)", async ({ generalFunctions, htmlInjection }) => {
  //   await test.step("Go to the 'HTML Injection Reflected (POST)' page", async () => {
  //     await generalFunctions.visitPage(pages.defaultPages.htmlInjectionStored);
  //   });

  //   await htmlInjection.verifyTableEntryInjection({});
  //   await htmlInjection.verifyTableEntryInjection({ encoded: true });
  // });
});
