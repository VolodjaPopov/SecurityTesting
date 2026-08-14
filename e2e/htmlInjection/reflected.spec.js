import { test } from "../../modules/base";
import pages from "../../fixtures/pages.json";

let page;

test.describe("HTML injection - Reflected (GET)", () => {
  test.beforeEach(async ({ wpage, login }) => {
    page = wpage;
    await login.loginUser({});
    await page.goto(
      `${process.env.BASE_URL}${pages.defaultPages.htmlInjectionReflectedGet}`
    );
  });

  test("Low security, GET (Field entry)", async ({ htmlInjection }) => {
    await htmlInjection.verifyNameFields({});
  });

  test("Low security, GET (URL entry)", async ({ htmlInjection }) => {
    await htmlInjection.verifyURLInjections({});
  });
});

test.describe("HTML injection - Reflected (POST)", () => {
  test.beforeEach(async ({ wpage, login }) => {
    page = wpage;
    await login.loginUser({});
    await page.goto(
      `${process.env.BASE_URL}${pages.defaultPages.htmlInjectionReflectedPost}`
    );
  });

  test("Low security, POST", async ({ htmlInjection }) => {
    await htmlInjection.verifyNameFields({});
  });
});

test.describe("HTML injection - Stored", () => {
  test.beforeEach(async ({ wpage, login }) => {
    page = wpage;
    await login.loginUser({});
    await page.goto(
      `${process.env.BASE_URL}${pages.defaultPages.htmlInjectionStored}`
    );
  });

  test("Low security, Stored", async ({ htmlInjection }) => {
    await htmlInjection.verifyTableEntryInjection({});
  });
});
