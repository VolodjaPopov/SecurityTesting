import { GeneralFunctions } from "./generalFunctions";

let generalFunctions;

export class SQLInjection {
  constructor(page) {
    this.page = page;
    generalFunctions = new GeneralFunctions(page);
    this.movieSearchField = page.locator('[id="title"]');
    this.searchButton = page.locator('[value="search"]:has-text("Search")');
    this.movieTable = page.locator('[id="table_yellow"]');
  }
}
