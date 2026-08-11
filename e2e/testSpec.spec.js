import { test, expect } from "../modules/base.js";

let page;

test.describe("Test describe", () => {
  test.beforeEach(async ({ wpage }) => {
    page = wpage;
    await page.goto("http://192.168.64.2/bWAPP/login.php");
    await expect(page.locator('[id="login"]')).toBeVisible();
  });

  test("Test test", async ({}) => {
    if (3 === 3) console.log("yes");
    await expect(true).toEqual(true);
  });
});
