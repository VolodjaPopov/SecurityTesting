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
    this.movieSelectField = page.locator('select[name="movie"]');
    this.searchButton = page.locator('[value="search"]:has-text("Search")');
    this.goButton = page.locator('[value="go"]:has-text("Go")');
    this.movieTable = page.locator('[id="table_yellow"]');
  }

  async verifySearchField(patterns = sqlPatterns.injectionsForGetString) {
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

  async verifyURLInjections({
    patterns = sqlPatterns.injectionsForGetInt,
    parameter = "movie",
    submitValid = true,
  }) {
    if (submitValid) {
      // await this.movieSelectField.click({ force: true });
      // await this.movieSelectField.locator("option").nth(0).click();
      await this.goButton.click();
    }
    for (const pattern of patterns) {
      let newURL = await generalFunctions.updateParam(parameter, pattern);
      await this.page.goto(newURL);

      // If the message for no movies available is visible then there are no SQL injections to be found
      if (
        await this.movieTable
          .locator(`td:has-text('${messages.noMoviesAvailable}')`)
          .isVisible()
      )
        log.plain("No SQL Injection error found for this pattern");
      else if (await this.movieTable.locator("a").nth(0).isVisible())
        log.warn(
          "Possible SQL Injection issue found for the following pattern\n" +
            pattern +
            "\n" +
            "please review manually"
        );
      else
        log.info(
          "Possible error relating to SQL found for the following pattern\n" +
            pattern +
            "\n" +
            "please review manually"
        );
    }
  }
}
