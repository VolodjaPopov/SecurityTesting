import { test } from "../../modules/base";
import pages from "../../fixtures/pages.json";

let page;

test.describe("HTML Injection tests (Low security)", () => {
  test.beforeEach(async ({ wpage, login }) => {
    page = wpage;
    await test.step("Log in with low security level", async () => {
      await login.loginUser({});
    });
  });

  test("Reflected GET (Field entry)", async ({ htmlInjection }) => {
    await test.step("Go to the 'HTML Injection Reflected (GET)' page", async () => {
      await page.goto(
        `${process.env.BASE_URL}${pages.defaultPages.htmlInjectionReflectedGet}`
      );
    });

    await test.step("Verify and log HTML injections for this page (by entering injections into the 'first name' field)", async () => {
      await htmlInjection.verifyNameFields({});
    });
  });

  test("Reflected GET (URL entry)", async ({ htmlInjection }) => {
    await test.step("Go to the 'HTML Injection Reflected (GET)' page", async () => {
      await page.goto(
        `${process.env.BASE_URL}${pages.defaultPages.htmlInjectionReflectedGet}`
      );
    });
    await test.step("Verify and log HTML injections for this page (by entering injections into the URL)", async () => {
      await htmlInjection.verifyURLInjections({});
    });
  });

  test("Reflected POST", async ({ htmlInjection }) => {
    await test.step("Go to the 'HTML Injection Reflected (POST)' page", async () => {
      await page.goto(
        `${process.env.BASE_URL}${pages.defaultPages.htmlInjectionReflectedPost}`
      );
    });

    await test.step("Verify and log HTML injections for this page (by entering injections into the 'first name' field)", async () => {
      await htmlInjection.verifyNameFields({});
    });
  });

  test("Stored (Blog)", async ({ htmlInjection }) => {
    await test.step("Go to the 'HTML Injection - Stored (Blog) page", async () => {
      await page.goto(
        `${process.env.BASE_URL}${pages.defaultPages.htmlInjectionStored}`
      );
    });

    await test.step("Verify and log HTML Injections for the table", async () => {
      await htmlInjection.verifyTableEntryInjection({});
    });
  });
});
