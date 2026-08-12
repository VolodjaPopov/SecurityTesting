import { GeneralFunctions } from "./generalFunctions";
import { log } from "./base";

let generalFunctions;

export class HTMLInjection {
  constructor(page) {
    this.page = page;
    generalFunctions = new GeneralFunctions(page);
    this.firstName = page.locator('[id="firstname"]');
    this.lastName = page.locator('[id="lastname"]');
    this.goButton = page.locator('button[value="submit"]:has-text("Go")');
  }

  async wrapHeading(value, heading = "h1") {
    let newValue = `<${heading}> ${value} </${heading}>`;
    return [newValue, heading];
  }

  async updateParam(parameter, newValue) {
    let currentURLStr = await this.page.url();
    let currentURL = new URL(currentURLStr);
    currentURL.searchParams.set(parameter, await newValue);
    return currentURL.toString();
  }

  async verifyURLInjections({
    firstName = generalFunctions.generateRandomString(10),
    lastName = generalFunctions.generateRandomString(10),
    parameter = "firstname",
    submitValid = true,
  }) {
    if (submitValid) {
      await this.firstName.fill(await firstName);
      await this.lastName.fill(await lastName);
      await this.goButton.click();
    }
    let wrappedFirstName = await this.wrapHeading(await firstName);
    let newURL = await this.updateParam(parameter, wrappedFirstName[0]);
    await this.page.goto(newURL);
    if (
      await this.page
        .locator(`${wrappedFirstName[1]}:has-text('${await firstName}')`)
        .isVisible()
    ) {
      log.warn(
        `The following field is vulnerable to HTML injections, broken by the following pattern:`
      );
      log.plain(wrappedFirstName[0]);
    } else log.info("No HTML injections found for this field");
  }

  async verifyNameFields({
    firstName = generalFunctions.generateRandomString(10),
    lastName = generalFunctions.generateRandomString(10),
    expectedInjection = "heading",
  }) {
    switch (expectedInjection) {
      case "heading":
        let wrappedFirstName = await this.wrapHeading(await firstName);
        await this.firstName.fill(wrappedFirstName[0]);
        await this.lastName.fill(await lastName);
        await this.goButton.click();
        if (
          await this.page
            .locator(`${wrappedFirstName[1]}:has-text('${await firstName}')`)
            .isVisible()
        )
          log.warn(
            `The following field is vulnerable to HTML injections, please review test carefully`
          );
        else log.info("No HTML injections found for this field");
        break;
    }
  }
}
