import { GeneralFunctions } from "./generalFunctions";
import { expect } from "./base";
import users from "../fixtures/users.json";

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
    this.loginButton = page.locator('button[value="submit"]');
    this.headerMenu = page.locator('[id="menu"]');
  }

  async loginUser({
    username = users.defaultUser.username,
    password = users.defaultUser.password,
    goToPage = true,
    success = true,
  }) {
    if (goToPage) await this.page.goto(`${process.env.BASE_URL}login.php`);
    await this.loginField.fill(await username);
    await this.passwordField.fill(await password);
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
}
