import { GeneralFunctions } from "./generalFunctions";
import { log } from "../modules/base";
import messages from "../fixtures/messages.json";
import sqlPatterns from "../fixtures/sqlInjectionPatterns.json";

let generalFunctions;

export class SQLInjection {
  constructor(page) {
    this.page = page;
    generalFunctions = new GeneralFunctions(page);
    this.movieSearchField = page.locator('[id="title"]');
    this.searchButton = page.locator('[value="search"]:has-text("Search")');
    this.movieTable = page.locator('[id="table_yellow"]');
  }

  async verifySearchField(patterns = sqlPatterns.injectionsForGetSelect) {
    for (const pattern of patterns) {
      await this.movieSearchField.fill(pattern);
      await this.searchButton.click();
      let tableRows = await this.movieTable.locator("tr").all();

      // If the message for no movies available is visible then there are no SQL injections to be found
      if (
        await this.movieTable
          .locator(`td:has-text('${messages.noMoviesAvailable}')`)
          .isVisible()
      )
        log.plain("No SQL Injection error found for this pattern");
      // If the table grows by some rows it means a request went through, which is worth investigating
      else if ((await tableRows.length) > 2)
        log.warn(
          "Possible SQL Injection issue found for the following pattern\n" +
            pattern +
            "\n" +
            "please review manually"
        );
      /* If the table doesn't change but no 'No movies' message is found that means some other error 
        (possibly relating to SQL) is visible, alo worth investigating */ else {
        log.info(
          "Possible error relating to SQL found for the following pattern\n" +
            pattern +
            "\n" +
            "please review manually"
        );
      }
    }
  }
}
