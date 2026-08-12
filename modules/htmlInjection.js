import { GeneralFunctions } from "./generalFunctions";
import { log } from "./base";
import messages from "../fixtures/messages.json";

let generalFunctions;

export class HTMLInjection {
  constructor(page) {
    this.page = page;
    generalFunctions = new GeneralFunctions(page);
    this.firstName = page.locator('[id="firstname"]');
    this.lastName = page.locator('[id="lastname"]');
    this.goButton = page.locator('button[value="submit"]:has-text("Go")');
    this.tableEntry = page.locator('[id="entry"]');
    this.tableSubmitButton = page.locator(
      'button[value="submit"]:has-text("Submit")'
    );
    this.addEntryButton = page.locator('[id="entry_add"]');
    this.allEntriesButton = page.locator('[id="entry_all"]');
    this.deleteEntryButton = page.locator('[id="entry_delete"]');
    this.table = page.locator('[id="table_yellow"]');
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
      log.warn(messages.htmlInjectionTrue);
      log.plain(wrappedFirstName[0]);
    } else log.info(messages.htmlInjectionFalse);
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
        ) {
          log.warn(messages.htmlInjectionTrue);
          log.plain(wrappedFirstName[0]);
        } else log.info(messages.htmlInjectionFalse);
        break;
    }
  }

  async verifyTableEntryInjection({
    value = generalFunctions.generateRandomString(10),
  }) {
    let wrappedValue = await this.wrapHeading(await value);
    await this.tableEntry.fill(wrappedValue[0]);
    await this.tableSubmitButton.click();
    if (
      await this.table
        .locator(`${wrappedValue[1]}:has-text('${await value}')`)
        .isVisible()
    ) {
      log.warn(messages.htmlInjectionTrue);
      log.plain(wrappedValue[0]);
    } else log.info(messages.htmlInjectionFalse);
  }
}
