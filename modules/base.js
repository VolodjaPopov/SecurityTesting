/*eslint no-empty-pattern: 0*/

import { chromium, test as baseTest } from "@playwright/test";
import { GeneralFunctions } from "./generalFunctions";
import { Login } from "./login";

const testPages = baseTest.extend({
  wpage: [
    async ({}, use) => {
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();

      await use(page);

      await page.close();
      await context.close();
      await browser.close();
    },
    { auto: true },
  ],
  generalFunctions: async ({ wpage }, use) => {
    await use(new GeneralFunctions(wpage));
  },
  login: async ({ wpage }, use) => {
    await use(new Login(wpage));
  },
});

export const test = testPages;
export const expect = testPages.expect;
