import { test } from "../../modules/base";
import pages from "../../fixtures/pages.json";

let page;

test.describe("HTML injection - Reflected (GET)", () => {
  test.beforeEach(async ({ wpage, login }) => {
    page = wpage;
    await login.loginUser({});
    await page.goto(
      `${process.env.BASE_URL}${pages.htmlInjectionReflectedGet}`
    );
  });

  test("Low security, GET (Field entry)", async ({ htmlInjection }) => {
    await htmlInjection.verifyNameFields({});
  });
});
