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
});
