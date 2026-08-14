import { test } from "../../modules/base";
import pages from "../../fixtures/pages.json";

let page;

test.describe("HTML Injection tests", () => {
  test.beforeEach(async ({ wpage, login }) => {
    page = wpage;
    await login.loginUser({});
  });

  test("Reflected GET (Field entry)", async ({ htmlInjection }) => {
    await page.goto(
      `${process.env.BASE_URL}${pages.defaultPages.htmlInjectionReflectedGet}`
    );
    await htmlInjection.verifyNameFields({});
  });

  test("Reflected GET (URL entry)", async ({ htmlInjection }) => {
    await page.goto(
      `${process.env.BASE_URL}${pages.defaultPages.htmlInjectionReflectedGet}`
    );
    await htmlInjection.verifyURLInjections({});
  });

  test("Reflected POST", async ({ htmlInjection }) => {
    await page.goto(
      `${process.env.BASE_URL}${pages.defaultPages.htmlInjectionReflectedPost}`
    );
    await htmlInjection.verifyNameFields({});
  });

  test("Stored (Blog)", async ({ htmlInjection }) => {
    await page.goto(
      `${process.env.BASE_URL}${pages.defaultPages.htmlInjectionStored}`
    );
    await htmlInjection.verifyTableEntryInjection({});
  });
});
