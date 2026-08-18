import { GeneralFunctions } from "./generalFunctions";
import { log } from "../modules/base";
import messages from "../fixtures/messages.json";
import pages from "../fixtures/pages.json";
import sqlPatterns from "../fixtures/sqlInjectionPatterns.json";
import picocolors from "picocolors";

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
      await this.verifyMovieTableErrorMessages(pattern);
    }
  }

  async verifyURLInjections({
    patterns = sqlPatterns.injectionsForGetInt,
    parameter = "movie",
    submitValid = pages.validGETRequestPages.getSelectValidOption,
  }) {
    if (submitValid) await this.page.goto(submitValid);
    for (const pattern of patterns) {
      let newURL = await generalFunctions.updateParam(parameter, pattern);
      await this.page.goto(newURL);
      await this.verifyMovieTableErrorMessages(pattern);
    }
  }

  async verifyMovieTableErrorMessages(pattern) {
    const border = "=".repeat(60);

    // If the 'No movies available' message is shown then there is no SQL injections available for that pattern
    if (
      await this.movieTable
        .locator(`td:has-text('${messages.noMoviesAvailable}')`)
        .isVisible()
    )
      log.info("No SQL Injection error found for this pattern");
    /* If the pattern returns a movie in the table that means there was an SQL injection 
       and the test should be carefully reviewd manually */ else if (
      await this.movieTable.locator("a").nth(0).isVisible()
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
