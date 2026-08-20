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

  async verifySearchField({
    patterns = sqlPatterns.injectionsForGetString,
    messagesToCheck = "table",
  }) {
    for (const pattern of patterns) {
      await this.movieSearchField.fill(pattern);
      await this.searchButton.click();
      switch (messagesToCheck) {
        case "table":
          await this.verifyMovieTableErrorMessages(pattern);
          break;
        case "boolean":
          await this.verifyMovieBooleanMessages(pattern);
          break;
      }
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

  async writeSQLWarningMessage(pattern) {
    const border = "=".repeat(60);
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
  }

  async writeSQLCautionMessage(pattern) {
    const border = "=".repeat(60);
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

  async verifyMovieTableErrorMessages(pattern) {
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
      await this.writeSQLWarningMessage(pattern);
    /* If neiter case happened that means the pattern didn't return an error message, but also didn't return any movies, 
       meaning a possible unrelated error (may be an error regarding SQL) happened, worth invesigating closer */ else
      await this.writeSQLCautionMessage(pattern);
  }

  async verifyMovieBooleanMessages(pattern) {
    // If the 'This movie doesn't exist' message is shown then there is no SQL injections available for that pattern
    if (
      await this.page
        .locator(`#main:has-text('${messages.movieDoesntExist}')`)
        .isVisible()
    )
      log.info("No SQL Injection error found for this pattern");
    /* If the pattern returns a 'This movie exists' message that means there was an SQL injection 
       and the test should be carefully reviewd manually */ else if (
      await this.page
        .locator(`#main:has-text('${messages.movieExists}')`)
        .isVisible()
    )
      await this.writeSQLWarningMessage(pattern);
    else await this.writeSQLCautionMessage(pattern);
  }

  async interceptAndModifyPostRequest({
    appPage = "sqli_13.php",
    optionToReplace = "4",
    fieldToReplace = "movie=",
    requestToInject = "99 or 1=1-- ",
  }) {
    await this.page.route(appPage, async (route, request) => {
      const postData = request.postData() || "";
      const newPostData = postData.replace(
        `${fieldToReplace}${optionToReplace}`,
        `${fieldToReplace}${requestToInject}`
      );

      await route.continue({
        postData: newPostData,
      });
    });
  }

  async selectMovieOption(option = "4") {
    await this.movieSelectField.selectOption(option);
    await this.goButton.click();
  }
}
