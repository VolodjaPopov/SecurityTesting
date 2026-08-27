import { log, expect } from "./base";
import messages from "../fixtures/messages.json";
import { GeneralFunctions } from "./generalFunctions";

let generalFunctions;

export class CommonActions {
  constructor(page) {
    this.page = page;
    generalFunctions = new GeneralFunctions(page);
    this.deleteTableRowsButton = page.locator('[id="entry_delete"]');
    this.addEntry = page.locator('[id="entry_add"]');
    this.submitButton = page.locator('[value="submit"]:has-text("Submit")');
  }

  async convertMovieIdToTitle(id) {
    let movies = [
      "G.I. Joe: Retaliation",
      "Iron Man",
      "Man of Steel",
      "Terminator Salvation",
      "The Amazing Spider-Man",
      "The Cabin in the Woods",
      "The Dark Knight Rises",
      "The Fast and the Furious",
      "The Incredible Hulk",
      "World War Z",
    ];
    return movies[id - 1];
  }

  async clearBlogTable(pageToVisit) {
    if (pageToVisit) await generalFunctions.visitPage(pageToVisit);
    await this.addEntry.click();
    await this.deleteTableRowsButton.click();
    await this.submitButton.click();
    await expect(
      this.page.locator(
        `font:has-text("${messages.appMessages.allEntriesDeleted}")`
      )
    ).toBeVisible();
  }

  async verifyAlertDialog(action) {
    const dialogPromise = this.page
      .waitForEvent("dialog", { timeout: 3000 })
      .catch(() => null);

    await action;

    const dialog = await dialogPromise;
    if (dialog) {
      log.warn(`${messages.customMessages.htmlInjectionTrue}\n
        Message: ${dialog.message()}`);
      await dialog.accept();
    } else log.info(messages.customMessages.htmlInjectionFalse);
  }
}
