import { GeneralFunctions } from "./generalFunctions";
import { log } from "./base";
import messages from "../fixtures/messages.json";
import htmlPatterns from "../fixtures/htmlInjectionPatterns.json";

let generalFunctions;

export class HTMLInjection {
  constructor(page) {
    this.page = page;
    generalFunctions = new GeneralFunctions(page);
    this.firstName = page.locator('[id="firstname"]');
    this.lastName = page.locator('[id="lastname"]');
    this.goButton = page.locator('button[value="submit"]:has-text("Go")');
    this.tableEntry = page.locator('[id="entry"]');
    this.tableSubmitButton = page
      .locator('button[value="submit"]:has-text("Submit")')
      .or(page.locator('button[value="add"]:has-text("Add Entry")'));
    this.addEntryButton = page.locator('[id="entry_add"]');
    this.allEntriesButton = page.locator('[id="entry_all"]');
    this.deleteEntryButton = page.locator('[id="entry_delete"]');
    this.table = page.locator('[id="table_yellow"]');
  }

  async wrapTag({ value, tag = "h1", encoded = false }) {
    let newValue;
    switch (encoded) {
      case true:
        newValue = `%3C${tag}%3E ${value} $3C%2F${tag}%3E`;
        break;
      case false:
        newValue = `<${tag}> ${value} </${tag}>`;
        break;
    }
    return [newValue, tag];
  }

  async verifyURLInjections({
    firstName = generalFunctions.generateRandomString(10),
    lastName = generalFunctions.generateRandomString(10),
    expectedTag = "h1",
    parameter = "firstname",
    submitValid = true,
    encoded = false,
    newId,
    newText,
  }) {
    if (submitValid) {
      await this.firstName.fill(await firstName);
      await this.lastName.fill(await lastName);
      await this.goButton.click();
    }
    let wrappedFirstName = await this.wrapTag({
      value: await firstName,
      tag: expectedTag,
      encoded,
    });
    let newURL = await generalFunctions.updateParam(
      parameter,
      wrappedFirstName[0]
    );
    await this.page.goto(newURL);
    switch (expectedTag) {
      case "h1":
        await this.verifyInjectionInNameField(
          wrappedFirstName[1],
          firstName,
          wrappedFirstName[0]
        );
        break;
      case "script":
        await this.verifyNewlyAddedField(newId, newText);
        break;
    }
  }

  async verifyNameFields({
    firstName = generalFunctions.generateRandomString(10),
    lastName = generalFunctions.generateRandomString(10),
    expectedTag = "h1",
    encoded = false,
    newId,
    newText,
  }) {
    switch (expectedTag) {
      case "h1":
        let wrappedFirstName = await this.wrapTag({
          value: await firstName,
          encoded,
        });
        await this.firstName.fill(wrappedFirstName[0]);
        await this.lastName.fill(await lastName);
        await this.goButton.click();
        await this.verifyInjectionInNameField(
          wrappedFirstName[1],
          firstName,
          wrappedFirstName[0]
        );
        break;
      case "script":
        let wrappedScript = await this.wrapTag({
          value: await firstName,
          tag: "script",
          encoded,
        });
        await this.firstName.fill(wrappedScript[0]);
        await this.lastName.fill(await lastName);
        await this.goButton.click();
        await this.verifyNewlyAddedField(newId, newText);
        break;
    }
  }

  async verifyInjectionInNameField(type, text, fullInjection) {
    if (
      await this.page.locator(`${type}:has-text('${await text}')`).isVisible()
    ) {
      log.warn(messages.customMessages.htmlInjectionTrue);
      log.plain(fullInjection);
      throw new Error(messages.customMessages.thrownError);
    } else log.info(messages.customMessages.htmlInjectionFalse);
  }

  async verifyNewlyAddedField(newId, newText) {
    if (
      await this.page
        .locator(`[id='id${newId}']:has-text('${newText}')`)
        .isVisible()
    ) {
      log.warn(messages.customMessages.htmlInjectionTrue);
      throw new Error(messages.customMessages.thrownError);
    } else log.info(messages.customMessages.htmlInjectionFalse);
  }

  async verifyTableEntryInjection({
    value = generalFunctions.generateRandomString(10),
    encoded = false,
  }) {
    let wrappedValue = await this.wrapTag({ value: await value, encoded });
    await this.tableEntry.fill(wrappedValue[0]);
    await this.tableSubmitButton.click();
    if (
      await this.table
        .locator(`${wrappedValue[1]}:has-text('${await value}')`)
        .isVisible()
    ) {
      log.warn(messages.customMessages.htmlInjectionTrue);
      log.plain(wrappedValue[0]);
      throw new Error(messages.customMessages.thrownError);
    } else log.info(messages.customMessages.htmlInjectionFalse);
  }

  async verifyInjectedWriteScriptInTable({
    value = htmlPatterns.noWrapping.scripts.writeLine,
    encoded = false,
  }) {
    let rowsBefore = await generalFunctions.countLocators(
      await this.table.locator("tr")
    );
    let wrappedValue = await this.wrapTag({
      value: await value,
      tag: "script",
      encoded,
    });
    await this.tableEntry.fill(wrappedValue[0]);
    await this.tableSubmitButton.click();
    let quotedValue = await generalFunctions.extractQuotedValue(value);
    let rowsAfter = await generalFunctions.countLocators(
      await this.table.locator("tr")
    );

    if (rowsAfter == rowsBefore + 1) {
      let lastRow = await this.table.locator("tr").last();
      let lastRowText = await lastRow.textContent();
      if (
        (await lastRowText.includes(quotedValue)) &&
        !(await lastRowText.includes("script"))
      ) {
        log.warn(messages.customMessages.htmlInjectionTrue);
        throw new Error(messages.customMessages.thrownError);
      } else {
        log.info(messages.customMessages.htmlInjectionFalse);
      }
    } else {
      log.caution(messages.customMessages.htmlInjectionCautionMessage);
      throw new Error(messages.customMessages.thrownCautionError);
    }
  }

  async verifyInjectionsInTableNoWrapping(pattern) {
    await this.tableEntry.fill(pattern);
    await this.tableSubmitButton.click();
    let lastRow = await this.table.locator("tr").last();
    let lastRowText = await lastRow.textContent();
    if (await lastRowText.includes(pattern))
      log.info(messages.customMessages.htmlInjectionFalse);
    else {
      log.caution(messages.customMessages.htmlInjectionCautionMessage);
      throw new Error(messages.customMessages.thrownCautionError);
    }
  }

  async injectHTML({
    elementType = "div",
    elementId = "xssInjectionTestElement",
    textContent = generalFunctions.generateRandomString(10),
  }) {
    const el = document.createElement(elementType);
    el.id = elementId;
    el.textContent = await textContent;
    document.body.appendChild(el);
  }

  async injectHTMLCodeAsString({
    elementType = "div",
    elementId = generalFunctions.generateRandomString(10),
    textContent = generalFunctions.generateRandomString(10),
  }) {
    let elId = await elementId;
    let text = await textContent;
    return `const el = document.createElement('${elementType}'); el.id = 'id${elId}'; el.textContent = '${text}'; document.body.appendChild(el);`;
  }
}
