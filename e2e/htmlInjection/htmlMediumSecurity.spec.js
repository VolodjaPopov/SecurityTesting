import { test } from "../../modules/base";
import pages from "../../fixtures/pages.json";

let page;

test.describe("HTML Injection tests", () => {
  test.beforeEach(async ({ wpage, login }) => {
    page = wpage;
    await login.loginUser({ securityLevel: "medium" });
  });

  test("Reflected GET (Field entry)", async ({ htmlInjection }) => {
    await page.goto(
      `${process.env.BASE_URL}${pages.defaultPages.htmlInjectionReflectedGet}`
    );
    await htmlInjection.verifyNameFields({});
    await htmlInjection.verifyNameFields({ encoded: true });
  });
});
