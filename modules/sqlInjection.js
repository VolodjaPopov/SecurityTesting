import { GeneralFunctions } from "./generalFunctions";
import { expect, log } from "../modules/base";
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
          let result = await this.verifyMovieTableErrorMessages(pattern);
          if (result === "injection")
            throw new Error(messages.customMessages.thrownError);
          else if (result === "caution") expect.soft(result).toBe(false);
          break;
        case "boolean":
          let resultBool = await this.verifyMovieBooleanMessages(pattern);
          if (resultBool === "injection")
            throw new Error(messages.customMessages.thrownError);
          else if (resultBool === "caution")
            expect.soft(resultBool).toBe(false);
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
      let result = await this.verifyMovieTableErrorMessages(pattern);
      if (result === "injection")
        throw new Error(messages.customMessages.thrownError);
      else if (result === "caution") expect.soft(result).toBe(false);
    }
  }

  async writeSQLWarningMessage(pattern) {
    const border = "=".repeat(60);
    log.warn(
      "\n" +
        picocolors.yellow(`${border}`) +
        "\n" +
        "\n" +
        `  ⚠  ${picocolors.bold(messages.customMessages.sqlInjectionTrue)}\n` +
        "\n" +
        `    ${picocolors.magenta(pattern)}\n` +
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
          messages.customMessages.sqlInjectionCautionMessage
        )}\n` +
        "\n" +
        `    ${picocolors.magenta(pattern)}\n` +
        "\n" +
        picocolors.cyan(`${border}`) +
        "\n"
    );
  }

  async verifyMovieTableErrorMessages(pattern) {
    // If the 'No movies available' message is shown then there is no SQL injections available for that pattern
    if (
      await this.movieTable
        .locator(`td:has-text('${messages.appMessages.noMoviesAvailable}')`)
        .isVisible()
    ) {
      log.info(messages.customMessages.sqlInjectionFalse);
      return false;
    } else if (await this.movieTable.locator("a").nth(0).isVisible()) {
      /* If the pattern returns a movie in the table that means there was an SQL injection 
       and the test should be carefully reviewd manually */
      await this.writeSQLWarningMessage(pattern);
      return "injection";
      /* If neiter case happened that means the pattern didn't return an error message, but also didn't return any movies, 
       meaning a possible unrelated error (may be an error regarding SQL) happened, worth invesigating closer */
    } else {
      await this.writeSQLCautionMessage(pattern);
      return "caution";
    }
  }

  async verifyMovieBooleanMessages(pattern) {
    // If the 'This movie doesn't exist' message is shown then there is no SQL injections available for that pattern
    if (
      await this.page
        .locator(`#main:has-text('${messages.appMessages.movieDoesntExist}')`)
        .isVisible()
    ) {
      log.info(messages.customMessages.sqlInjectionFalse);
      return false;
    } else if (
      /* If the pattern returns a 'This movie exists' message that means there was an SQL injection 
       and the test should be carefully reviewd manually */
      await this.page
        .locator(`#main:has-text('${messages.appMessages.movieExists}')`)
        .isVisible()
    ) {
      await this.writeSQLWarningMessage(pattern);
      return "injection";
    } else {
      await this.writeSQLCautionMessage(pattern);
      return "caution";
    }
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

  async returnMovieTitleFromTable(position = 1) {
    return await this.movieTable
      .locator("tr")
      .nth(position)
      .locator("td")
      .nth(0)
      .textContent();
  }
}
