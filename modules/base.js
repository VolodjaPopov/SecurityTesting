/*eslint no-empty-pattern: 0*/

import { chromium, test as baseTest } from "@playwright/test";
import { GeneralFunctions } from "./generalFunctions";
import { Login } from "./login";
import { HTMLInjection } from "./htmlInjection";
import { SQLInjection } from "./sqlInjection";
import { CommonActions } from "./commonActions";

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
  commonActions: async ({ wpage }, use) => {
    await use(new CommonActions(wpage));
  },
  login: async ({ wpage }, use) => {
    await use(new Login(wpage));
  },
  htmlInjection: async ({ wpage }, use) => {
    await use(new HTMLInjection(wpage));
  },
  sqlInjection: async ({ wpage }, use) => {
    await use(new SQLInjection(wpage));
  },
});

const colors = {
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
};

function write(prefix, message, color) {
  process.stdout.write(`${color}${prefix}${colors.reset} ${message}\n`);
}

function writePlain(message) {
  process.stdout.write(`${message}\n`);
}

export const log = {
  success: (msg) => write("[SUCCESS]", msg, colors.green),
  warn: (msg) => write("[WARNING]", msg, colors.yellow),
  error: (msg) => write("[ERROR]", msg, colors.red),
  caution: (msg) => write("[CAUTION]", msg, colors.cyan),
  info: (msg) => write("[INFO]", msg, colors.white),
  plain: (msg) => writePlain(msg),
};
export const test = testPages;
export const expect = testPages.expect;
