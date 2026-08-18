import { GeneralFunctions } from "./generalFunctions";
import { expect } from "./base";
import { log } from "./base";
import users from "../fixtures/users.json";
import messages from "../fixtures/messages.json";
import sqlPatterns from "../fixtures/sqlInjectionPatterns.json";
import picocolors from "picocolors";

let generalFunctions;

export class Login {
  constructor(page) {
    this.page = page;
    generalFunctions = new GeneralFunctions(page);
    this.loginField = page.locator('[id="login"]');
    this.passwordField = page.locator('[id="password"]');
    this.securityLevelBox = page.locator('[name="security_level"]');
    this.lowOption = this.securityLevelBox.locator('[value="0"]');
    this.mediumOption = this.securityLevelBox.locator('[value="1"]');
    this.highOption = this.securityLevelBox.locator('[value="2"]');
    this.loginButton = page.locator('button[value="submit"]:has-text("Login")');
    this.headerMenu = page.locator('[id="menu"]');
  }

  async loginUser({
    username = users.defaultUser.username,
    password = users.defaultUser.password,
    goToPage = true,
    success = true,
    securityLevel = "low",
  }) {
    if (goToPage) await this.page.goto(`${process.env.BASE_URL}login.php`);
    await this.loginField.fill(await username);
    await this.passwordField.fill(await password);
    switch (securityLevel) {
      case "low":
        break;
      case "medium":
        await this.securityLevelBox.selectOption("1");
        break;
      case "high":
        await this.securityLevelBox.selectOption("2");
        break;
    }
    await this.loginButton.click();
    switch (success) {
      case true:
        await expect(this.headerMenu).toContainText(`Welcome ${username}`, {
          ignoreCase: true,
        });
        await generalFunctions.checkForElementVisibility(
          [this.loginField, this.passwordField],
          false
        );
        break;
      case false:
        await generalFunctions.checkForElementVisibility([
          this.loginField,
          this.passwordField,
        ]);
        break;
    }
  }

  async verifyLoginPageInjections({
    patterns = sqlPatterns.injectionsForGetString,
    username,
  }) {
    for (const pattern of patterns) {
      if (username) {
        await this.loginField.fill(await username);
        await this.passwordField.fill(await pattern);
      } else {
        await this.loginField.fill(await pattern);
        await this.passwordField.fill(
          await generalFunctions.generateRandomString(10)
        );
      }
      await this.loginButton.click();
      await this.verifyLoginPageErrors(pattern);
    }
  }

  async verifyLoginPageErrors(pattern) {
    const border = "=".repeat(60);

    // If the 'Invalid credentials' message is shown then there is no SQL injections available for that pattern
    if (
      await this.page
        .locator(`font:has-text('${messages.invalidCredentials}')`)
        .isVisible()
    )
      log.info("No SQL Injection error found for this pattern");
    /* If the pattern returns a movie in the table that means there was an SQL injection 
       and the test should be carefully reviewd manually */ else if (
      await this.page.locator("p:has-text('Your secret:')").isVisible()
    )
      log.warn(
        "\n" +
          picocolors.yellow(`${border}`) +
          "\n" +
          "\n" +
          `  ⚠  ${picocolors.bold(
            "Possible SQL Injection issue found for the following pattern"
          )}\n` +
          "\n" +
          `    ${picocolors.magenta(pattern)}\n` +
          "\n" +
          `  ${picocolors.dim("Please review test manually.")}\n` +
          "\n" +
          picocolors.yellow(`${border}`) +
          "\n"
      );
    /* If neiter case happened that means the pattern didn't return an error message, but also didn't return any movies, 
       meaning a possible unrelated error (may be an error regarding SQL) happened, worth invesigating closer */ else
      log.caution(
        "\n" +
          picocolors.cyan(`${border}`) +
          "\n" +
          "\n" +
          `  ⚠  ${picocolors.bold(
            "Possible error relating to SQL found for the following pattern"
          )}\n` +
          "\n" +
          `    ${picocolors.magenta(pattern)}\n` +
          "\n" +
          `  ${picocolors.dim("Consider reviewing test manually.")}\n` +
          "\n" +
          picocolors.cyan(`${border}`) +
          "\n"
      );
  }
}
